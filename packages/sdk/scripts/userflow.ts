import { accountFromPrivateKey } from "@repo/btc";
import { createConfig } from "@wagmi/core";
import { anvil } from "@wagmi/core/chains";
import { hexToBytes, http, parseEther, parseUnits, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { getCurrentTimestamp } from "@/helpers";
import type { CreateOrderArgs } from "@/types";

import { FusionUniversalKit } from "../src";

// Default Anvil Accounts
const maker = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);
const taker = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);

const makerBtc = accountFromPrivateKey(
  "23f0a64d6c7aaef0e77f5b5d4cbe3c4f53fab7e72e5bb4846973976485df1b58",
);
const takerBtc = accountFromPrivateKey(
  "aba30087566cc7da6865abc4ba82348cc53ac80bbb9a038a630e1f7fcea2533e",
);

const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});

const main = async () => {
  const sdk = new FusionUniversalKit(config, maker);

  // Step 1: Create Order
  const orderDetails: CreateOrderArgs = {
    maker: {
      destinationAddress: {
        chain: { type: "btc" },
        data: toHex(Buffer.from(makerBtc.account.address ?? "")),
      },
      provides: {
        amount: parseEther("0.001"),
        type: "ether",
      },
      sourceAddress: {
        chain: { chainId: anvil.id, type: "evm" },
        data: maker.address,
      },
      wants: {
        amount: parseUnits("0.00001", 8),
        type: "btc",
      },
    },
  };

  const order = sdk.createOrder(orderDetails);

  // Step 2: Taker create a Bitcoin HTLC
  const htlcDetails = sdk.createHTLC({
    hashlock: Buffer.from(hexToBytes(order.hashlock)),
    locktime: getCurrentTimestamp() + order.timelocks.cancellationPeriod,
    receiverPublicKey: makerBtc.keyPair.publicKey,
    senderPublicKey: takerBtc.keyPair.publicKey,
  });

  console.log("HTLC Address: ", htlcDetails.address);

  // Step 3: Maker deploys Escrow Contract
  const escrowAddress = await sdk.deployEvmEscrow({
    order,
    taker: {
      destinationAddress: {
        chain: { type: "btc" },
        data: toHex(Buffer.from(takerBtc.account.address ?? "")),
      },
      sourceAddress: {
        chain: { chainId: anvil.id, type: "evm" },
        data: taker.address,
      },
    },
  });

  console.log("Escrow Address:", escrowAddress);

  // Step 4: Taker Funds the HTLC
  const { txId } = await sdk.fundBtcEscrow({
    amountInSatoshis: Number(order.maker.wants.amount),
    btcWallet: takerBtc,
    htlcConfig: htlcDetails,
  });

  console.log("Funding TX ID:", txId);

  // Step 5: Maker reveals secret and claims btc from HTLC

  // Step 6: Taker sees the revealed secret and claims the eth from Escrow
};

await main();
