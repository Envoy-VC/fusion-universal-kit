/** biome-ignore-all lint/style/noNonNullAssertion: safe */

import * as bitcoin from "bitcoinjs-lib";

import type { CreateHTLCArgs, HTLCResult } from "@/types";

export const createHTLC = (args: CreateHTLCArgs): HTLCResult => {
  const { senderPublicKey, receiverPublicKey, hashlock, locktime } = args;
  const redeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_IF!,
    bitcoin.opcodes.OP_SHA256!,
    hashlock,
    bitcoin.opcodes.OP_EQUALVERIFY!,
    receiverPublicKey,
    bitcoin.opcodes.OP_CHECKSIG!,
    bitcoin.opcodes.OP_ELSE!,
    bitcoin.script.number.encode(locktime),
    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY!,
    bitcoin.opcodes.OP_DROP!,
    senderPublicKey,
    bitcoin.opcodes.OP_CHECKSIG!,
    bitcoin.opcodes.OP_ENDIF!,
  ]);

  const witnessScript = redeemScript;
  const scriptHash = bitcoin.crypto.sha256(witnessScript);
  const lockingScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_0!,
    scriptHash,
  ]);
  const address = bitcoin.address.fromOutputScript(
    lockingScript,
    bitcoin.networks.regtest,
  );

  return {
    address,
    lockingScript,
    redeemScript,
    scriptHash,
    witnessScript,
  };
};
