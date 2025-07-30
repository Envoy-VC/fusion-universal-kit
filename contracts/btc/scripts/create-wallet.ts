// createAddress.js

import bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.regtest; // Nigiri uses regtest

const keyPair = ECPair.makeRandom({ network });
const { address } = bitcoin.payments.p2wpkh({
  network,
  pubkey: Buffer.from(keyPair.publicKey),
});

console.log(`🔑 Private Key (WIF): ${keyPair.toWIF()}`);
console.log(`💰 Address to Fund:   ${address}`);
