import crypto from "node:crypto";

import { type Hex, toHex } from "viem";

import { getCurrentTimestamp } from "@/helpers";

import type { CreateOrderArgs, FusionOrder } from "../types";

export const createOrder = (args: CreateOrderArgs) => {
  const secret = crypto.randomBytes(32);
  const secretHex = toHex(secret);
  const hashlock: Hex = `0x${crypto.createHash("sha256").update(secret).digest().toString("hex")}`;

  const order: FusionOrder = {
    hashlock,

    maker: args.maker,
    network: args.maker.sourceAddress.chain,
    orderId: crypto.randomUUID(),
    secret: secretHex,
    status: "created",

    timelocks: {
      cancellationPeriod: 3600, // 1 hour
      withdrawalPeriod: 0, // Immediate Withdrawal
    },

    timestamp: getCurrentTimestamp(),
  };

  return order;
};
