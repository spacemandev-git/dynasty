// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract DeployNFT is Script {
    function run() public {
        vm.broadcast();
        NFT nft = new NFT("dfdao", "DFD");
        vm.stopBroadcast();
    }
}
