import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

import type { BtcWallet } from "@/types";

export const createWallet = (): BtcWallet => {
  const ECPair = ECPairFactory(ecc);

  const keyPair = ECPair.makeRandom({ network: bitcoin.networks.regtest });
  const account = bitcoin.payments.p2wpkh({
    network: bitcoin.networks.regtest,
    pubkey: Buffer.from(keyPair.publicKey),
  });

  return {
    account,
    keyPair,
  };
};

export const accountFromPrivateKey = (privateKey: string): BtcWallet => {
  const ECPair = ECPairFactory(ecc);
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));

  const account = bitcoin.payments.p2wpkh({
    network: bitcoin.networks.regtest,
    pubkey: Buffer.from(keyPair.publicKey),
  });

  return {
    account,
    keyPair,
  };
};
