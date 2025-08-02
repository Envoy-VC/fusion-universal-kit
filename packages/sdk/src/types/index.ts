import type { Hex } from "viem";

type ContractAddressMap = Record<number, Hex>;

export type FusionKitCreateParams = {
  escrowFactory: ContractAddressMap;
};
