// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console2 as console} from "forge-std/console2.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {EscrowFactory} from "src/EscrowFactory.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        IERC20 accessToken = IERC20(address(0));

        EscrowFactory factory = new EscrowFactory(accessToken, deployerAddress, 0, 0, 0, deployerAddress);
        console.log("Factory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}
