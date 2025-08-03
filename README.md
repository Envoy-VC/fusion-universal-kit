# Fusion Universal Kit 🔄

> **Cross-Chain Atomic Swap Protocol between EVM and Bitcoin Networks**

Fusion Universal Kit is an atomic swap protocol that enables trustless, decentralized exchanges between Ethereum Virtual Machine (EVM) chains and Bitcoin. Built as an extension of the Fusion+ protocol from 1inch, this kit provides a complete solution for cross-chain asset swaps with enhanced security and user experience.

## 🏗️ Architecture

### Core Components

#### 1. **EVM Contracts** (`contracts/evm/`)
- **EscrowFactory.sol**: Factory contract for creating escrow instances
- **EscrowSrc.sol**: Source escrow for EVM→BTC swaps
- **EscrowDst.sol**: Destination escrow for BTC→EVM swaps
- **BaseEscrow.sol**: Abstract base contract with common functionality

#### 2. **Bitcoin Contracts** (`contracts/btc/`)
- **HTLC Implementation**: Native Bitcoin HTLC using P2WSH (Pay-to-Witness-Script-Hash)
- **Transaction Management**: UTXO handling and transaction creation
- **Script Generation**: Bitcoin script compilation for HTLC operations

#### 3. **SDK** (`packages/sdk/`)
- **Unified Interface**: Single SDK for both EVM and Bitcoin operations
- **Type Safety**: Full TypeScript support with comprehensive types
- **Wagmi Integration**: Modern Ethereum interaction patterns

## 🔄 Atomic Swap Flow

### Complete User Flow

1. **Order Creation**: Maker creates a swap order with desired amounts
2. **HTLC Creation**: Taker creates Bitcoin HTLC with shared hashlock
3. **Escrow Deployment**: Maker deploys EVM escrow contract
4. **Bitcoin Funding**: Taker funds the Bitcoin HTLC
5. **Secret Revelation**: Maker claims Bitcoin by revealing the secret
6. **EVM Withdrawal**: Taker claims EVM assets using the revealed secret

### Detailed Technical Flow

```typescript
// 1. Create Order
const order = sdk.createOrder({
  maker: {
    provides: { amount: "0.001", type: "ether" },
    wants: { amount: "0.0001", type: "btc" },
    sourceAddress: { chain: { chainId: 1, type: "evm" }, data: makerAddress },
    destinationAddress: { chain: { type: "btc" }, data: makerBtcAddress }
  }
});

// 2. Create Bitcoin HTLC
const htlcDetails = sdk.createHTLC({
  hashlock: Buffer.from(order.hashlock.slice(2), "hex"),
  locktime: timestamp + order.timelocks.cancellationPeriod,
  receiverPublicKey: makerBtc.keyPair.publicKey,
  senderPublicKey: takerBtc.keyPair.publicKey
});

// 3. Deploy EVM Escrow
const { escrowAddress } = await sdk.deployEvmEscrow({
  order,
  taker: { /* taker details */ }
});

// 4. Fund Bitcoin HTLC
const { txId } = await sdk.fundBtcEscrow({
  amountInSatoshis: Number(order.maker.wants.amount),
  btcWallet: takerBtc,
  htlcConfig: htlcDetails
});

// 5. Claim Bitcoin
const claimTxId = await sdk.claimBtcEscrow({
  btcWallet: makerBtc,
  htlcAmount: Number(order.maker.wants.amount),
  htlcArgs: createHtlcArgs,
  htlcTxid: txId,
  htlcVout: 0,
  secret: Buffer.from(hexToBytes(order.secret))
});

// 6. Withdraw from EVM Escrow
const withdrawTxId = await sdk.withdrawEvmEscrow({
  escrowAddress,
  immutables,
  secret: order.secret
});
```

## 🔐 Bitcoin HTLC Implementation

### HTLC Script Structure

The Bitcoin HTLC uses a sophisticated script that enables both claim and refund scenarios:

```typescript
// HTLC Script Logic
OP_IF
  OP_SHA256
  <hashlock>
  OP_EQUALVERIFY
  <receiverPublicKey>
  OP_CHECKSIG
OP_ELSE
  <locktime>
  OP_CHECKLOCKTIMEVERIFY
  OP_DROP
  <senderPublicKey>
  OP_CHECKSIG
OP_ENDIF
```

### Key Features

- **P2WSH Address**: Uses native SegWit for better efficiency
- **Dual Paths**: Supports both claim (with secret) and refund (after timeout)
- **Time-Locked Refunds**: Automatic refund capability after locktime
- **Signature Verification**: Secure multi-signature requirements

### Claim Transaction Structure

```typescript
// Witness Stack for Claim: <signature> <secret> <1> <witnessScript>
const witnessStack = [
  signature,           // Receiver's signature
  secret,             // Revealed secret
  Buffer.from([1]),   // Choose IF branch
  witnessScript       // Full HTLC script
];
```

## 🏭 EVM Contract Architecture

### Factory Pattern

The `EscrowFactory` uses a factory pattern with Create2 for deterministic address generation:

```solidity
function createSrcEscrow(IBaseEscrow.Immutables calldata immutables) 
    external payable returns (address) {
    // Validate requirements
    // Deploy escrow with Create2
    // Transfer tokens to escrow
    // Emit creation event
}
```

### Escrow States

1. **Created**: Escrow deployed with locked funds
2. **Active**: Waiting for counterparty action
3. **Claimed**: Funds withdrawn with valid secret
4. **Cancelled**: Funds returned after timeout
5. **Rescued**: Emergency withdrawal by taker

### Security Features

- **Access Token**: Required for public operations
- **Timelocks**: Configurable timeouts for safety
- **Immutable Parameters**: Prevents parameter manipulation
- **Reentrancy Protection**: Secure against reentrancy attacks

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9.4.0
- Foundry (for EVM contracts)
- Bitcoin Core (for Bitcoin operations)

### Installation

```bash
# Clone repository
git clone https://github.com/Envoy-VC/fusion-universal-kit.git
cd fusion-universal-kit

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Configure your environment variables

# Build all packages
pnpm build
```

### Project Structure

```
fusion-universal-kit/
├── contracts/
│   ├── btc/          # Bitcoin HTLC implementation
│   └── evm/          # EVM escrow contracts
├── packages/
│   ├── sdk/          # TypeScript SDK
│   └── config/       # Shared configuration
├── scripts/          # Development scripts
└── turbo.json        # Build configuration
```

## 📚 API Reference

### SDK Methods

#### Order Management
- `createOrder(args: CreateOrderArgs)`: Create new swap order
- `getOrder(orderId: string)`: Retrieve order details

#### Bitcoin Operations
- `createHTLC(args: CreateHTLCArgs)`: Create Bitcoin HTLC
- `fundBtcEscrow(args: FundBtcEscrowArgs)`: Fund Bitcoin HTLC
- `claimBtcEscrow(args: CreateClaimTxArgs)`: Claim Bitcoin from HTLC

#### EVM Operations
- `deployEvmEscrow(args: DeployEvmEscrowArgs)`: Deploy EVM escrow
- `withdrawEvmEscrow(args: WithdrawEvmEscrowArgs)`: Withdraw from EVM escrow

### Contract Interfaces

#### EscrowFactory
```solidity
function createSrcEscrow(Immutables calldata immutables) 
    external payable returns (address)
function createDstEscrow(Immutables calldata immutables) 
    external payable returns (address)
```

#### BaseEscrow
```solidity
function withdraw(bytes32 secret, Immutables calldata immutables) external
function cancel(Immutables calldata immutables) external
function rescueFunds(address token, uint256 amount, Immutables calldata immutables) external
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **1inch Network**: Original Fusion+ protocol
- **Bitcoin Core**: Bitcoin script implementation
- **OpenZeppelin**: Security patterns and contracts
- **Wagmi**: Modern Ethereum interaction patterns
