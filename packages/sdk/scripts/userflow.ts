import { accountFromPrivateKey, getBtcBalance } from "@repo/btc";
import { createConfig, getBalance } from "@wagmi/core";
import { anvil } from "@wagmi/core/chains";
import {
  formatUnits,
  hexToBytes,
  http,
  parseEther,
  parseUnits,
  toHex,
} from "viem";
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
  "f9545a0d23184ffafa67b66b6f266da92c7d288d1e910ab6891339198da5c658",
);
const takerBtc = accountFromPrivateKey(
  "29d3d7803fe083712b98fc7c21c718c49ddf6f9a8d29f5bc20c1257a5438e461",
);

const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});

const logBalances = async () => {
  const makerBtcBalance = await getBtcBalance(makerBtc.account.address ?? "");
  const takerBtcBalance = await getBtcBalance(takerBtc.account.address ?? "");
  const makerEthBalance = await getBalance(config, {
    address: maker.address,
  });
  const takerEthBalance = await getBalance(config, {
    address: taker.address,
  });

  console.log("============== Balances ==============\n");
  console.log("Maker BTC Balance:", formatUnits(makerBtcBalance, 8));
  console.log("Maker ETH Balance:", formatUnits(makerEthBalance.value, 18));
  console.log("\n");
  console.log("Taker BTC Balance:", formatUnits(takerBtcBalance, 8));
  console.log("Taker ETH Balance:", formatUnits(takerEthBalance.value, 18));
};

const main = async () => {
  const sdk = new FusionUniversalKit(config, maker);

  console.log("Maker ETH Address:", maker.address);
  console.log("Taker ETH Address:", taker.address);
  console.log("Maker BTC Address:", makerBtc.account.address ?? "");
  console.log("Taker BTC Address:", takerBtc.account.address ?? "");

  await logBalances();

  console.log("\n⏳ Creating Order...");

  // Step 1: Create Order
  const orderDetails: CreateOrderArgs = {
    maker: {
      destinationAddress: {
        chain: { type: "btc" },
        data: toHex(Buffer.from(makerBtc.account.address ?? "")),
      },
      provides: {
        amount: parseEther("0.1"),
        type: "ether",
      },
      sourceAddress: {
        chain: { chainId: anvil.id, type: "evm" },
        data: maker.address,
      },
      wants: {
        amount: parseUnits("0.003", 8),
        type: "btc",
      },
    },
  };

  const order = sdk.createOrder(orderDetails);

  console.log("✅ Order created successfully! Order ID:", order.orderId);

  console.log("\n⏳ Creating Bitcoin HTLC...");

  // Step 2: Taker create a Bitcoin HTLC
  const createHtlcArgs = {
    hashlock: Buffer.from(order.hashlock.slice(2), "hex"),
    locktime: getCurrentTimestamp() + order.timelocks.cancellationPeriod,
    receiverPublicKey: makerBtc.keyPair.publicKey,
    senderPublicKey: takerBtc.keyPair.publicKey,
  };
  const htlcDetails = sdk.createHTLC(createHtlcArgs);

  console.log(
    "✅ HTLC created successfully! HTLC Address:",
    htlcDetails.address,
  );
  console.log("💵 HTLC Balance:", await getBtcBalance(htlcDetails.address));

  console.log("\n⏳ Deploying Escrow Contract...");

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

  console.log(
    "✅ Escrow deployed successfully! Escrow Address:",
    escrowAddress,
  );
  await logBalances();

  console.log("\n⏳ Funding HTLC...");

  // Step 4: Taker Funds the HTLC
  const { txId } = await sdk.fundBtcEscrow({
    amountInSatoshis: Number(order.maker.wants.amount),
    btcWallet: takerBtc,
    htlcConfig: htlcDetails,
  });

  console.log("✅ HTLC funded successfully! HTLC TXID:", txId);
  await logBalances();

  console.log("💵 HTLC Balance:", await getBtcBalance(htlcDetails.address));

  console.log("\n⏳ Claiming BTC Escrow...");

  // Step 5: Maker reveals secret and claims btc from HTLC
  const claimTxId = await sdk.claimBtcEscrow({
    btcWallet: makerBtc,
    htlcAmount: Number(order.maker.wants.amount),
    htlcArgs: createHtlcArgs,
    htlcTxid: txId,
    htlcVout: 0,
    secret: Buffer.from(hexToBytes(order.secret)),
  });

  console.log("✅ BTC Escrow claimed successfully! Claim TXID:", claimTxId);

  await logBalances();

  console.log("💵 HTLC Balance:", await getBtcBalance(htlcDetails.address));

  // Step 6: Taker sees the revealed secret and claims the eth from Escrow
};

await main();
