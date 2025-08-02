import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import type { Abi } from "viem";

import { abi as escrowFactoryAbi } from "../../contracts/evm/out/EscrowFactory.sol/EscrowFactory.json";

export default defineConfig({
  contracts: [
    {
      abi: escrowFactoryAbi as Abi,
      address: "0x0000000000000000000000000000000000000000",
      name: "EscrowFactory",
    },
  ],
  out: "./src/generated/wagmi.ts",
  plugins: [actions()],
});
