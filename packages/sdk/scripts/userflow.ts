import { accountFromPrivateKey, getBtcBalance } from "@repo/btc";
import { createConfig, getBalance } from "@wagmi/core";
import { anvil } from "@wagmi/core/chains";
import {
  formatUnits,
  type Hex,
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
  "0x879165d71dc5fa6ee33e435afaa02dcd3faa6b971781099b229dac9163eeab9f",
);
const taker = privateKeyToAccount(
  "0xdbb5455481accbf80f75577759a1be8b4cabf90ae985537d4574614d09072f36",
);

// Testing BTC Accounts
const makerBtc = accountFromPrivateKey(
  "f9545a0d23184ffafa67b66b6f266da92c7d288d1e910ab6891339198da5c658",
);
const takerBtc = accountFromPrivateKey(
  "29d3d7803fe083712b98fc7c21c718c49ddf6f9a8d29f5bc20c1257a5438e461",
);

const wait = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});

const fetchBalance = async (address: string) => {
  if (address.startsWith("0x")) {
    const balance = await getBalance(config, {
      address: address as Hex,
    });
    return formatUnits(balance.value, 18);
  } else {
    const balance = await getBtcBalance(address);
    return formatUnits(balance, 8);
  }
};

const main = async () => {
  const sdk = new FusionUniversalKit(config, maker);
  const sdkTaker = new FusionUniversalKit(config, taker);

  console.log("============== Addresses ==============");
  console.log("Maker ETH Address:", maker.address);
  console.log("Maker BTC Address:", makerBtc.account.address);
  console.log("\nTaker ETH Address:", taker.address);
  console.log("Taker BTC Address:", takerBtc.account.address);
  console.log("======================================\n");

  console.log("============== Initial Balances ==============");
  console.log("Maker ETH  Balance:", await fetchBalance(maker.address));
  console.log(
    "Maker BTC Balance:",
    await fetchBalance(makerBtc.account.address),
  );
  console.log("\nTaker ETH Address:", await fetchBalance(taker.address));

  console.log(
    "Taker BTC Balance:",
    await fetchBalance(takerBtc.account.address),
  );
  console.log("======================================\n");

  await wait(2000);

  console.log("\n⏳ Creating Order...");

  // Step 1: Create Order
  const orderDetails: CreateOrderArgs = {
    maker: {
      destinationAddress: {
        chain: { type: "btc" },
        data: toHex(Buffer.from(makerBtc.account.address)),
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
        amount: parseUnits("0.0001", 8),
        type: "btc",
      },
    },
  };

  const order = sdk.createOrder(orderDetails);

  console.log("✅ Order created successfully! Order ID:", order.orderId);
  console.log(
    `🔄 Swap Order from ${formatUnits(order.maker.provides.amount, 18)} ETH to ${formatUnits(order.maker.wants.amount, 8)} BTC`,
  );
  console.log("🔒 Hashlock: ", order.hashlock);

  console.log("\n⏳ Creating Bitcoin HTLC...");
  await wait(2000);

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
  console.log("💵 HTLC Balance:", await fetchBalance(htlcDetails.address));

  console.log("\n⏳ Deploying Escrow Contract...");
  console.log(
    "Maker ETH Balance before Escrow Deployment:",
    await fetchBalance(maker.address),
  );
  await wait(5000);

  // Step 3: Maker deploys Escrow Contract
  const { escrowAddress, immutables } = await sdk.deployEvmEscrow({
    order,
    taker: {
      destinationAddress: {
        chain: { type: "btc" },
        data: toHex(Buffer.from(takerBtc.account.address)),
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
  await wait(1000);
  console.log("Escrow Balance:", await fetchBalance(escrowAddress));
  await wait(1000);
  console.log(
    "Maker ETH Balance after Escrow Deployment:",
    await fetchBalance(maker.address),
  );

  console.log("\n⏳ Taker Funds HTLC...");
  console.log(
    "Taker BTC Balance before HTLC Funding:",
    await fetchBalance(htlcDetails.address),
  );
  await wait(6000);

  // Step 4: Taker Funds the HTLC
  const { txId } = await sdk.fundBtcEscrow({
    amountInSatoshis: Number(order.maker.wants.amount),
    btcWallet: takerBtc,
    htlcConfig: htlcDetails,
  });

  console.log("✅ HTLC funded successfully! HTLC TXID:", txId);
  await wait(1000);
  console.log("💵 HTLC Balance:", await fetchBalance(htlcDetails.address));
  await wait(500);
  console.log(
    "Taker BTC Balance after HTLC Funding:",
    await fetchBalance(takerBtc.account.address),
  );

  console.log("\n⏳ Claiming BTC Escrow...");
  console.log(
    "Maker BTC Balance before Claiming:",
    await fetchBalance(makerBtc.account.address),
  );
  await wait(5000);

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
  await wait(1000);
  console.log("💵 HTLC Balance:", await fetchBalance(htlcDetails.address));
  console.log(
    "Maker BTC Balance after Claiming:",
    await fetchBalance(makerBtc.account.address),
  );

  // Step 6: Taker sees the revealed secret and claims the eth from Escrow

  console.log(
    "Taker ETH Balance before withdrawal:",
    await fetchBalance(taker.address),
  );

  const evmWithdrawoTxId = await sdkTaker.withdrawEvmEscrow({
    escrowAddress,
    immutables,
    secret: order.secret,
  });

  console.log(
    "✅ EVM Escrow withdrawn successfully! Withdraw TXID:",
    evmWithdrawoTxId,
  );
  console.log(
    "Taker ETH Balance after withdrawal:",
    await fetchBalance(taker.address),
  );
};

await main();
