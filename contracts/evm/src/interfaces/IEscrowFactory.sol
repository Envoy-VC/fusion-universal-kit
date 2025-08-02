// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Address} from "../libraries/AddressLib.sol";
import {IBaseEscrow} from "./IBaseEscrow.sol";

interface IEscrowFactory {
    /// @notice Thrown when insufficient ETH is sent for escrow creation
    error InsufficientEscrowBalance();

    /**
     * @notice Emitted when a source escrow
     * @param escrow The address of the created source escrow
     * @param hashlock The hash of the secret
     * @param maker The address of the maker
     * @param creator The address of who created the escrow
     */
    event SrcEscrowCreated(address escrow, bytes32 hashlock, Address maker, address indexed creator);

    /**
     * @notice Emitted when a destination escrow is created
     * @param escrow The address of the created destination escrow
     * @param hashlock The hash of the secret
     * @param taker The address of the taker
     * @param creator The address of who created the escrow
     */
    event DstEscrowCreated(address escrow, bytes32 hashlock, Address taker, address indexed creator);

    /**
     * @notice Creates a source escrow
     * @param immutables The escrow immutables
     */
    function createSrcEscrow(IBaseEscrow.Immutables calldata immutables) external payable;

    /**
     * @notice Creates a destination escrow
     * @param immutables The escrow immutables
     */
    function createDstEscrow(IBaseEscrow.Immutables calldata immutables) external payable;

    /**
     * @notice Returns the deterministic address of a source escrow
     * @param immutables The escrow immutables
     * @return The computed address of the source escrow
     */
    function addressOfEscrowSrc(IBaseEscrow.Immutables calldata immutables) external view returns (address);

    /**
     * @notice Returns the deterministic address of a destination escrow
     * @param immutables The escrow immutables
     * @return The computed address of the destination escrow
     */
    function addressOfEscrowDst(IBaseEscrow.Immutables calldata immutables) external view returns (address);

    /**
     * @notice Returns the source escrow implementation address
     * @return The address of the source escrow implementation
     */
    function ESCROW_SRC_IMPLEMENTATION() external view returns (address);

    /**
     * @notice Returns the destination escrow implementation address
     * @return The address of the destination escrow implementation
     */
    function ESCROW_DST_IMPLEMENTATION() external view returns (address);
}
