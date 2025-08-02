import {
  createReadContract,
  createSimulateContract,
  createWatchContractEvent,
  createWriteContract,
} from "@wagmi/core/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EscrowFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const escrowFactoryAbi = [
  {
    inputs: [
      { internalType: "contract IERC20", name: "accessToken", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint32", name: "rescueDelaySrc", type: "uint32" },
      { internalType: "uint32", name: "rescueDelayDst", type: "uint32" },
      { internalType: "uint256", name: "_creationFee", type: "uint256" },
      { internalType: "address", name: "_treasury", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ACCESS_TOKEN",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ESCROW_DST_IMPLEMENTATION",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ESCROW_SRC_IMPLEMENTATION",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "bytes32", name: "hashlock", type: "bytes32" },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "maker",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "taker",
            type: "tuple",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "safetyDeposit", type: "uint256" },
          { internalType: "Timelocks", name: "timelocks", type: "uint256" },
        ],
        internalType: "struct IBaseEscrow.Immutables",
        name: "immutables",
        type: "tuple",
      },
    ],
    name: "addressOfEscrowDst",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "bytes32", name: "hashlock", type: "bytes32" },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "maker",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "taker",
            type: "tuple",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "safetyDeposit", type: "uint256" },
          { internalType: "Timelocks", name: "timelocks", type: "uint256" },
        ],
        internalType: "struct IBaseEscrow.Immutables",
        name: "immutables",
        type: "tuple",
      },
    ],
    name: "addressOfEscrowSrc",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "bytes32", name: "hashlock", type: "bytes32" },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "maker",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "taker",
            type: "tuple",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "safetyDeposit", type: "uint256" },
          { internalType: "Timelocks", name: "timelocks", type: "uint256" },
        ],
        internalType: "struct IBaseEscrow.Immutables",
        name: "immutables",
        type: "tuple",
      },
    ],
    name: "createDstEscrow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "bytes32", name: "hashlock", type: "bytes32" },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "maker",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "source",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "enum ChainType",
                    name: "chain",
                    type: "uint8",
                  },
                  { internalType: "bytes", name: "data", type: "bytes" },
                ],
                internalType: "struct UniversalAddress",
                name: "destination",
                type: "tuple",
              },
            ],
            internalType: "struct Address",
            name: "taker",
            type: "tuple",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "safetyDeposit", type: "uint256" },
          { internalType: "Timelocks", name: "timelocks", type: "uint256" },
        ],
        internalType: "struct IBaseEscrow.Immutables",
        name: "immutables",
        type: "tuple",
      },
    ],
    name: "createSrcEscrow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "creationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newFee", type: "uint256" }],
    name: "setCreationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newTreasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "CreationFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "escrow",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "hashlock",
        type: "bytes32",
      },
      {
        components: [
          {
            components: [
              { internalType: "enum ChainType", name: "chain", type: "uint8" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct UniversalAddress",
            name: "source",
            type: "tuple",
          },
          {
            components: [
              { internalType: "enum ChainType", name: "chain", type: "uint8" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct UniversalAddress",
            name: "destination",
            type: "tuple",
          },
        ],
        indexed: false,
        internalType: "struct Address",
        name: "taker",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "DstEscrowCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "escrow",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "hashlock",
        type: "bytes32",
      },
      {
        components: [
          {
            components: [
              { internalType: "enum ChainType", name: "chain", type: "uint8" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct UniversalAddress",
            name: "source",
            type: "tuple",
          },
          {
            components: [
              { internalType: "enum ChainType", name: "chain", type: "uint8" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
            internalType: "struct UniversalAddress",
            name: "destination",
            type: "tuple",
          },
        ],
        indexed: false,
        internalType: "struct Address",
        name: "maker",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "SrcEscrowCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldTreasury",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "TreasuryUpdated",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error",
  },
  { inputs: [], name: "Create2EmptyBytecode", type: "error" },
  { inputs: [], name: "FailedCall", type: "error" },
  { inputs: [], name: "FailedDeployment", type: "error" },
  { inputs: [], name: "FeeTransferFailed", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  { inputs: [], name: "InsufficientEscrowBalance", type: "error" },
  { inputs: [], name: "InvalidFeeAmount", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
] as const;

export const escrowFactoryAddress =
  "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35" as const;

export const escrowFactoryConfig = {
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__
 */
export const readEscrowFactory = /*#__PURE__*/ createReadContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"ACCESS_TOKEN"`
 */
export const readEscrowFactoryAccessToken = /*#__PURE__*/ createReadContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
  functionName: "ACCESS_TOKEN",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"ESCROW_DST_IMPLEMENTATION"`
 */
export const readEscrowFactoryEscrowDstImplementation =
  /*#__PURE__*/ createReadContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "ESCROW_DST_IMPLEMENTATION",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"ESCROW_SRC_IMPLEMENTATION"`
 */
export const readEscrowFactoryEscrowSrcImplementation =
  /*#__PURE__*/ createReadContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "ESCROW_SRC_IMPLEMENTATION",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"addressOfEscrowDst"`
 */
export const readEscrowFactoryAddressOfEscrowDst =
  /*#__PURE__*/ createReadContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "addressOfEscrowDst",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"addressOfEscrowSrc"`
 */
export const readEscrowFactoryAddressOfEscrowSrc =
  /*#__PURE__*/ createReadContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "addressOfEscrowSrc",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"creationFee"`
 */
export const readEscrowFactoryCreationFee = /*#__PURE__*/ createReadContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
  functionName: "creationFee",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const readEscrowFactoryOwner = /*#__PURE__*/ createReadContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
  functionName: "owner",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"treasury"`
 */
export const readEscrowFactoryTreasury = /*#__PURE__*/ createReadContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
  functionName: "treasury",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__
 */
export const writeEscrowFactory = /*#__PURE__*/ createWriteContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"createDstEscrow"`
 */
export const writeEscrowFactoryCreateDstEscrow =
  /*#__PURE__*/ createWriteContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "createDstEscrow",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"createSrcEscrow"`
 */
export const writeEscrowFactoryCreateSrcEscrow =
  /*#__PURE__*/ createWriteContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "createSrcEscrow",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeEscrowFactoryRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "renounceOwnership",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"setCreationFee"`
 */
export const writeEscrowFactorySetCreationFee =
  /*#__PURE__*/ createWriteContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "setCreationFee",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"setTreasury"`
 */
export const writeEscrowFactorySetTreasury = /*#__PURE__*/ createWriteContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
  functionName: "setTreasury",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeEscrowFactoryTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__
 */
export const simulateEscrowFactory = /*#__PURE__*/ createSimulateContract({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"createDstEscrow"`
 */
export const simulateEscrowFactoryCreateDstEscrow =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "createDstEscrow",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"createSrcEscrow"`
 */
export const simulateEscrowFactoryCreateSrcEscrow =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "createSrcEscrow",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateEscrowFactoryRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "renounceOwnership",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"setCreationFee"`
 */
export const simulateEscrowFactorySetCreationFee =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "setCreationFee",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"setTreasury"`
 */
export const simulateEscrowFactorySetTreasury =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "setTreasury",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link escrowFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateEscrowFactoryTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__
 */
export const watchEscrowFactoryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: escrowFactoryAbi,
  address: escrowFactoryAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__ and `eventName` set to `"CreationFeeUpdated"`
 */
export const watchEscrowFactoryCreationFeeUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    eventName: "CreationFeeUpdated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__ and `eventName` set to `"DstEscrowCreated"`
 */
export const watchEscrowFactoryDstEscrowCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    eventName: "DstEscrowCreated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchEscrowFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    eventName: "OwnershipTransferred",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__ and `eventName` set to `"SrcEscrowCreated"`
 */
export const watchEscrowFactorySrcEscrowCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    eventName: "SrcEscrowCreated",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link escrowFactoryAbi}__ and `eventName` set to `"TreasuryUpdated"`
 */
export const watchEscrowFactoryTreasuryUpdatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: escrowFactoryAbi,
    address: escrowFactoryAddress,
    eventName: "TreasuryUpdated",
  });
