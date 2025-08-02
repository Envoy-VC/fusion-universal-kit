import type { Config } from "@wagmi/core";

import type { FusionKitCreateParams } from "./types";

export class FusionUniversalKit {
  private config: Config;
  private params: FusionKitCreateParams;

  constructor(config: Config, params: FusionKitCreateParams) {
    this.config = config;
  }

  getEscrowFactoryAddress(chainId: number) {
    return this.params.escrowFactory[chainId];
  }
}
