import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import type { Abi } from "viem";

import { abi as escrowFactoryAbi } from "../../contracts/evm/out/EscrowFactory.sol/EscrowFactory.json";

export default defineConfig({
  contracts: [
    {
      abi: escrowFactoryAbi as Abi,
      address: "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35",
      name: "EscrowFactory",
    },
  ],
  out: "./src/generated/wagmi.ts",
  plugins: [actions()],
});
