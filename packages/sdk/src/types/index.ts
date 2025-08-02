import type { Hex } from "viem";

export type ContractAddressMap = Record<number, Hex>;

export type FusionKitCreateParams = {
  escrowFactory: ContractAddressMap;
};

export type Network = { type: "evm"; chainId: number } | { type: "btc" };

export type UniversalAddress = {
  chain: Network;
  data: Hex;
};

export type Asset =
  | {
      type: "ether";
      amount: bigint;
    }
  | {
      type: "erc20";
      address: Hex;
      amount: bigint;
    }
  | {
      type: "btc";
      amount: bigint;
    };

export type FusionOrder = {
  orderId: string;
  timestamp: number;
  network: Network;

  maker: {
    sourceAddress: UniversalAddress;
    destinationAddress: UniversalAddress;
    provides: Asset;
    wants: Asset;
  };

  secret: Hex;
  hashlock: Hex;

  timelocks: {
    withdrawalPeriod: number;
    cancellationPeriod: number;
  };

  status: "pending" | "fulfilled" | "cancelled" | "created" | "expired";
};
