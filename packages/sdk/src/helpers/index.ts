import type { UniversalAddress } from "@/types";

export const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

export const toUniversalAddress = (address: UniversalAddress) => {
  if (address.chain.type === "evm") {
    return {
      chain: 0,
      data: address.data,
    };
  }

  return {
    chain: 1,
    data: address.data,
  };
};
