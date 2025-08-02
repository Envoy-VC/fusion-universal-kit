import type { BtcWallet, HTLCResult } from "@repo/btc";
import { getUTXOs } from "@repo/btc";
import * as bitcoin from "bitcoinjs-lib";

import { broadcastTransaction } from "../../../../../contracts/btc/src/actions/broadcast-tx";

interface FundBtcEscrowArgs {
  htlcConfig: HTLCResult;
  btcWallet: BtcWallet;
  amountInSatoshis: number;
}

export const fundBtcEscrow = async (args: FundBtcEscrowArgs) => {
  if (!args.btcWallet.account.address) {
    throw new Error("No address found for wallet");
  }

  const amount = args.amountInSatoshis;
  const bitcoinNetwork = bitcoin.networks.regtest;
  const fromAddress = args.btcWallet.account.address;
  const utxos = await getUTXOs(args.btcWallet.account.address);

  const totalAvailable = utxos.reduce((sum, utxo) => sum + utxo.value, 0);

  const fee = 1000;

  if (totalAvailable < amount + fee) {
    throw new Error(
      `❌ Insufficient funds. Available: ${totalAvailable}, Required: ${amount + fee} (including fees)`,
    );
  }

  const keyPair = args.btcWallet.keyPair;
  const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

  let inputValue = 0;
  for (const utxo of utxos) {
    if (inputValue >= amount + fee) break;

    // For P2WPKH addresses, use witnessUtxo instead of nonWitnessUtxo
    // P2WPKH script: OP_0 <20-byte-pubkey-hash>
    const p2wpkhScript = bitcoin.payments.p2wpkh({
      address: fromAddress,
      network: bitcoinNetwork,
    }).output;

    if (p2wpkhScript) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: p2wpkhScript,
          value: utxo.value,
        },
      });

      inputValue += utxo.value;
    }
  }

  // Add output to HTLC
  psbt.addOutput({
    address: args.htlcConfig.address,
    value: amount,
  });

  // Add change output if needed
  const change = inputValue - amount - fee;
  if (change > 546) {
    // Dust threshold
    psbt.addOutput({
      address: fromAddress,
      value: change,
    });
  }

  // Sign all inputs
  for (let i = 0; i < psbt.inputCount; i++) {
    psbt.signInput(i, keyPair);
  }

  psbt.finalizeAllInputs();
  const txHex = psbt.extractTransaction().toHex();

  const broadcastTxId = await broadcastTransaction(txHex);

  return {
    txHex,
    txId: broadcastTxId,
  };
};
