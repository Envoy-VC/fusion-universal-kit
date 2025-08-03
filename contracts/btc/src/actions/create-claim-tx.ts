import * as bitcoin from "bitcoinjs-lib";

import type { CreateClaimTxArgs, CreateClaimTxResult } from "@/types";

import { createHTLC } from "./create-htlc";

export const createClaimTransaction = ({
  htlcArgs,
  htlcTxid,
  htlcVout,
  htlcAmount,
  secret,
  feeRate = 10,
  btcWallet,
}: CreateClaimTxArgs): CreateClaimTxResult => {
  const htlc = createHTLC(htlcArgs);

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });

  // P2WSH claim
  psbt.addInput({
    hash: htlcTxid,
    index: htlcVout,
    witnessScript: htlc.witnessScript,
    witnessUtxo: {
      script: htlc.lockingScript,
      value: htlcAmount,
    },
  });

  const estimatedSize = 150;
  const fee = Math.ceil(estimatedSize * feeRate);
  const outputAmount = htlcAmount - fee;

  psbt.addOutput({
    address: btcWallet.account.address ?? "",
    value: outputAmount,
  });

  // Sign the input first
  psbt.signInput(0, btcWallet.keyPair);

  // Custom finalizer for HTLC claim (revealing secret)
  // biome-ignore lint/suspicious/noExplicitAny: safe
  psbt.finalizeInput(0, (_inputIndex: number, input: any) => {
    // Get signature from the input - ensure it's DER encoded
    const rawSignature = input.partialSig[0].signature;

    // The signature from PSBT should already be DER encoded, but let's verify
    let signature: Buffer;
    try {
      // Try to decode the signature to verify it's properly formatted
      bitcoin.script.signature.decode(rawSignature);
      signature = rawSignature;
    } catch (_error: unknown) {
      throw new Error(
        "Signature format issue - please use the direct claim script instead",
      );
    }

    // Create witness stack for HTLC claim: <signature> <secret> <1> <witnessScript>
    const witnessStack = [
      signature,
      secret,
      Buffer.from([1]), // Choose the IF branch
      htlc.witnessScript,
    ];

    return {
      finalScriptSig: Buffer.alloc(0),
      finalScriptWitness: Buffer.concat([
        Buffer.from([witnessStack.length]),
        ...witnessStack.map((item) => {
          const itemBuffer = Buffer.isBuffer(item) ? item : Buffer.from(item);
          return Buffer.concat([Buffer.from([itemBuffer.length]), itemBuffer]);
        }),
      ]),
    };
  });

  const tx = psbt.extractTransaction();

  return {
    fee,
    hex: tx.toHex(),
    txid: tx.getId(),
    vsize: tx.virtualSize(),
    witnessHash: tx.getHash(true).toString("hex"),
  };
};
