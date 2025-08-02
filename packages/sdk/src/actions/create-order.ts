import crypto from "crypto";

import { type Hex, toHex } from "viem";

import { getCurrentTimestamp } from "@/helpers";

import type { Asset, FusionOrder, UniversalAddress } from "../types";

interface CreateOrderArgs {
  maker: {
    sourceAddress: UniversalAddress;
    destinationAddress: UniversalAddress;
    provides: Asset;
    wants: Asset;
  };
}

export const createOrder = (args: CreateOrderArgs) => {
  const secret = toHex(crypto.randomBytes(32));
  const hashlock: Hex = `0x${crypto.createHash("sha256").update(secret).digest().toString("hex")}`;

  const order: FusionOrder = {
    hashlock,

    maker: args.maker,
    network: args.maker.sourceAddress.chain,
    orderId: crypto.randomUUID(),
    secret,
    status: "created",

    timelocks: {
      cancellationPeriod: 3600, // 1 hour
      withdrawalPeriod: 0, // Immediate Withdrawal
    },

    timestamp: getCurrentTimestamp(),
  };

  return order;
};
