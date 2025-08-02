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
