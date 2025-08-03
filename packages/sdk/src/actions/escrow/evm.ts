import {
  type Config,
  getBalance,
  getBlock,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { createWriteContract } from "@wagmi/core/codegen";
import {
  type Account,
  keccak256,
  parseEther,
  parseEventLogs,
  zeroAddress,
} from "viem";

import {
  escrowFactoryAbi,
  escrowSrcAbi,
  readEscrowFactoryCreationFee,
  writeEscrowFactoryCreateSrcEscrow,
} from "@/generated/wagmi";
import { toUniversalAddress } from "@/helpers";
import type { DeployEvmEscrowArgs, WithdrawEvmEscrowArgs } from "@/types";

export const deployEvmEscrow = async (
  wagmiConfig: Config,
  escrowArgs: DeployEvmEscrowArgs,
  account?: Account,
) => {
  const { order, taker } = escrowArgs;
  const client = wagmiConfig.getClient();

  if (order.network.type !== "evm") {
    throw new Error("Invalid network type");
  }
  if (client.chain.id !== order.network.chainId) {
    throw new Error("Invalid chainId");
  }

  if (order.maker.sourceAddress.data !== account?.address) {
    throw new Error("Source Address does not match order maker");
  }

  // For anvil now is from rpc call
  const now = (await getBlock(wagmiConfig, { blockTag: "latest" })).timestamp;
  console.log(now);
  const safetyDeposit = parseEther("0");
  const creationFee = await readEscrowFactoryCreationFee(wagmiConfig, {
    args: [],
  });
  const escrowAmount = BigInt(order.maker.provides.amount);

  const totalAmount = escrowAmount + creationFee + safetyDeposit;

  const balance = await getBalance(wagmiConfig, {
    address: order.maker.sourceAddress.data,
  });

  if (balance.value < totalAmount) {
    throw new Error("Insufficient balance");
  }

  // Create escrow immutables
  const dstWithdrawal = order.timelocks.withdrawalPeriod;
  const dstPublicWithdrawal = order.timelocks.withdrawalPeriod * 2;
  const dstCancellation = order.timelocks.cancellationPeriod;

  // Pack timelocks
  const timelocks =
    (BigInt(now) << 224n) |
    (BigInt(dstCancellation) << 64n) |
    (BigInt(dstPublicWithdrawal) << 32n) |
    BigInt(dstWithdrawal);

  const immutables = {
    amount: escrowAmount,
    hashlock: order.hashlock,
    maker: {
      destination: toUniversalAddress(order.maker.destinationAddress),
      source: toUniversalAddress(order.maker.sourceAddress),
    },
    orderHash: keccak256(Buffer.from(order.orderId)),
    safetyDeposit,
    taker: {
      destination: toUniversalAddress(taker.destinationAddress),
      source: toUniversalAddress(taker.sourceAddress),
    },
    timelocks: timelocks,
    token: zeroAddress,
  };

  const hash = await writeEscrowFactoryCreateSrcEscrow(wagmiConfig, {
    account,
    args: [immutables],
    value: totalAmount,
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

  const logs = parseEventLogs({ abi: escrowFactoryAbi, logs: receipt.logs });
  // biome-ignore lint/style/noNonNullAssertion: safe
  const creationLog = logs.find((l) => l.eventName === "SrcEscrowCreated")!;
  const escrowAddress = creationLog.args.escrow;

  return { escrowAddress, immutables };
};

export const withdrawEvmEscrow = async (
  wagmiConfig: Config,
  args: WithdrawEvmEscrowArgs,
  account?: Account,
) => {
  const { escrowAddress, secret, immutables } = args;

  const writeEscrowSrcWithdraw = createWriteContract({
    abi: escrowSrcAbi,
    address: escrowAddress,
    functionName: "withdraw",
  });

  const hash = await writeEscrowSrcWithdraw(wagmiConfig, {
    account,
    args: [secret, immutables],
  });

  await waitForTransactionReceipt(wagmiConfig, { hash });

  return hash;
};
