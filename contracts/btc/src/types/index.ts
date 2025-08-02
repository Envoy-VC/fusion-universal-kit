import type * as bitcoin from "bitcoinjs-lib";
import type { ECPairInterface } from "ecpair";

export type HTLCResult = {
  address: string;
  lockingScript: Buffer;
  redeemScript: Buffer;
  scriptHash: Buffer;
  witnessScript: Buffer;
};

export type BtcWallet = {
  account: bitcoin.payments.Payment;
  keyPair: ECPairInterface;
};

export interface CreateHTLCArgs {
  senderPublicKey: Buffer;
  receiverPublicKey: Buffer;
  hashlock: Buffer;
  locktime: number;
}

export interface CreateClaimTxArgs {
  htlcArgs: CreateHTLCArgs;
  htlcTxid: string;
  htlcVout: number;
  htlcAmount: number;
  secret: Buffer;
  feeRate?: number;
  btcWallet: BtcWallet;
}

export interface CreateClaimTxResult {
  fee: number;
  hex: string;
  txid: string;
  vsize: number;
  witnessHash: string;
}
