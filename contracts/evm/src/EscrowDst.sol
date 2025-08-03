// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AddressLib, UniversalAddress} from "./libraries/AddressLib.sol";
import {Timelocks, TimelocksLib} from "./libraries/TimelocksLib.sol";

import {IBaseEscrow} from "./interfaces/IBaseEscrow.sol";
import {BaseEscrow} from "./BaseEscrow.sol";
import {Escrow} from "./Escrow.sol";

contract EscrowDst is Escrow {
    using AddressLib for UniversalAddress;
    using SafeERC20 for IERC20;
    using TimelocksLib for Timelocks;

    constructor(uint32 rescueDelay, IERC20 accessToken) payable BaseEscrow(rescueDelay, accessToken) {}

    receive() external payable {}

    /**
     * @notice Private withdrawal by maker using secret
     * @dev Maker reveals secret to claim EVM tokens after providing Bitcoin
     * @param secret The secret that matches the hashlock
     * @param immutables The escrow immutables
     */
    function withdraw(bytes32 secret, Immutables calldata immutables)
        external
        override
        onlyValidImmutables(immutables)
        onlyValidSecret(secret, immutables)
        onlyAfter(immutables.timelocks.get(TimelocksLib.Stage.DstWithdrawal))
        onlyBefore(immutables.timelocks.get(TimelocksLib.Stage.DstCancellation))
    {
        // Allow both maker and taker to withdraw in private period
        if (
            msg.sender != immutables.maker.source.toEthAddress() && msg.sender != immutables.taker.source.toEthAddress()
        ) {
            revert InvalidCaller();
        }

        _withdraw(secret, immutables);
    }

    /**
     * @notice Public withdrawal by anyone with access token
     * @dev Anyone with access token can trigger withdrawal in public period
     * @param secret The secret that matches the hashlock
     * @param immutables The escrow immutables
     */
    function publicWithdraw(bytes32 secret, Immutables calldata immutables)
        external
        onlyAccessTokenHolder
        onlyValidImmutables(immutables)
        onlyValidSecret(secret, immutables)
        onlyAfter(immutables.timelocks.get(TimelocksLib.Stage.DstPublicWithdrawal))
        onlyBefore(immutables.timelocks.get(TimelocksLib.Stage.DstCancellation))
    {
        _withdraw(secret, immutables);
    }

    /**
     * @notice Cancels escrow and returns funds to taker
     * @dev Can only be called after cancellation period starts
     * @param immutables The escrow immutables
     */
    function cancel(Immutables calldata immutables)
        external
        override
        onlyTaker(immutables)
        onlyValidImmutables(immutables)
        onlyAfter(immutables.timelocks.get(TimelocksLib.Stage.DstCancellation))
    {
        // Return tokens to taker
        _uniTransfer(immutables.token, immutables.taker.source.toEthAddress(), immutables.amount);
        // Return safety deposit to taker
        _ethTransfer(immutables.taker.source.toEthAddress(), immutables.safetyDeposit);

        emit EscrowCancelled();
    }

    /**
     * @dev Internal withdrawal logic
     * @param secret The secret that unlocks the escrow
     * @param immutables The escrow immutables
     */
    function _withdraw(bytes32 secret, Immutables calldata immutables) internal {
        // Transfer tokens to maker
        _uniTransfer(immutables.token, immutables.maker.source.toEthAddress(), immutables.amount);

        // Return safety deposit to taker
        _ethTransfer(immutables.taker.source.toEthAddress(), immutables.safetyDeposit);

        emit EscrowWithdrawal(secret);
    }
}
