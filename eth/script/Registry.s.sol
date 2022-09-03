// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Registry.sol";
import "../src/NFT.sol";

contract DeployRegistry is Script {
    function run() public {
        vm.broadcast();
        Registry registry = new Registry();

        vm.stopBroadcast();
    }
}
