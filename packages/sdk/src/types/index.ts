import type { BtcWallet, HTLCResult } from "@repo/btc";
import type { Hex } from "viem";

export type ContractAddressMap = Record<number, Hex>;

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
  hashlock: string;

  timelocks: {
    withdrawalPeriod: number;
    cancellationPeriod: number;
  };

  status: "pending" | "fulfilled" | "cancelled" | "created" | "expired";
};

export interface CreateOrderArgs {
  maker: {
    sourceAddress: UniversalAddress;
    destinationAddress: UniversalAddress;
    provides: Asset;
    wants: Asset;
  };
}

export interface DeployEvmEscrowArgs {
  order: FusionOrder;
  taker: {
    sourceAddress: UniversalAddress;
    destinationAddress: UniversalAddress;
  };
}

export interface FundBtcEscrowArgs {
  htlcConfig: HTLCResult;
  btcWallet: BtcWallet;
  amountInSatoshis: number;
}
