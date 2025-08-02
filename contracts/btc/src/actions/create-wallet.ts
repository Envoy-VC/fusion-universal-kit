import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

import type { BtcWallet } from "@/types";

export const createWallet = (network: bitcoin.Network): BtcWallet => {
  const ECPair = ECPairFactory(ecc);

  const keyPair = ECPair.makeRandom({ network });
  const account = bitcoin.payments.p2wpkh({
    network,
    pubkey: Buffer.from(keyPair.publicKey),
  });

  return {
    account,
    keyPair,
  };
};
