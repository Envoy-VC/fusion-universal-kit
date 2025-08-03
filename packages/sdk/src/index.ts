import {
  type CreateClaimTxArgs,
  type CreateHTLCArgs,
  createHTLC,
} from "@repo/btc";
import type { Config } from "@wagmi/core";
import type { Account } from "viem";

import * as actions from "./actions";
import type {
  CreateOrderArgs,
  DeployEvmEscrowArgs,
  FundBtcEscrowArgs,
  WithdrawEvmEscrowArgs,
} from "./types";

export class FusionUniversalKit {
  private config: Config;
  private account: Account | undefined;

  constructor(config: Config, account?: Account) {
    this.config = config;
    this.account = account;
  }

  createOrder(args: CreateOrderArgs) {
    return actions.createOrder(args);
  }

  createHTLC(args: CreateHTLCArgs) {
    return createHTLC(args);
  }

  async deployEvmEscrow(args: DeployEvmEscrowArgs) {
    return await actions.deployEvmEscrow(this.config, args, this.account);
  }

  async fundBtcEscrow(args: FundBtcEscrowArgs) {
    return await actions.fundBtcEscrow(args);
  }

  async claimBtcEscrow(args: CreateClaimTxArgs) {
    return await actions.claimBtcEscrow(args);
  }

  async withdrawEvmEscrow(args: WithdrawEvmEscrowArgs) {
    return await actions.withdrawEvmEscrow(this.config, args, this.account);
  }
}
