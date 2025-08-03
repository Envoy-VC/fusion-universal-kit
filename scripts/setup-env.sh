#!/bin/bash

# Deploy Foundry Contracts
cd contracts/evm
forge script script/Deploy.s.sol:DeployScript --fork-url http://localhost:8545 --broadcast --verify --verifier blockscout --verifier-url http://localhost/api/

# Fund EVM Wallets
cast send 0x99b24ae3CA377979F234c8c8245eE8813aD2ed9e --value 0.1ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://127.0.0.1:8545

cast send 0xA5695dAD3C24bE58103F4a27eBC2F7fe9509Ede0 --value 0.1ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://127.0.0.1:8545

# Fund BTC Wallets
nigiri faucet bcrt1qcklf4hrg5rctuuk6yq8ssr4t88yqfdp0qmftcd 0.001
nigiri faucet bcrt1q7tq3x8rdfzzv7hfunk9l99wxuwdj5tfgvd8mvv 0.001