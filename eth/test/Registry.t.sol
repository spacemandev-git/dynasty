// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {Registry} from "../src/Registry.sol";

contract RegistryTest is Test {
    Registry registry;

    address deployer = address(1);
    address nonOwner = address(2);

    struct GrandPrixMetadata {
        uint256 startTime;
        uint256 endTime;
        bytes32 configHash;
        // Address of first map with this config. Future maps will be created from this
        address parentAddress;
        uint256 seasonId;
    }

    event GrandPrixAdded(uint256 indexed id, bytes32 indexed configHash);

    function setUp() public {
        vm.startPrank(deployer);
        registry = new Registry();
        vm.stopPrank();
    }

    function testSetOwner() public {
        vm.prank(deployer);
        registry.setContractOwner(nonOwner);
        assertEq(registry.contractOwner(), nonOwner);
    }

    function testNonOwnerSetOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert(bytes("Not contract owner"));
        registry.setContractOwner(deployer);
    }

    function testCannotSetOwnerZero() public {
        vm.prank(deployer);
        vm.expectRevert(bytes("Owner cannot be zero address"));
        registry.setContractOwner(address(0));
    }

    function testOwnerisAdmin() public {
        vm.prank(deployer);
        assert(registry.isAdmin(deployer));
    }

    function testAddGame() public {
        vm.prank(deployer);
        vm.expectEmit(true, true, false, false);
        emit GrandPrixAdded(
            0,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            )
        );
        registry.addGrandPrix(
            12345,
            12346,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            ),
            0x274c4753194d1b181DEd46958F150ec15b5f604b,
            1
        );
    }

    function testNonAdminAddGame() public {
        vm.prank(nonOwner);
        vm.expectRevert(bytes("Not admin"));
        registry.addGrandPrix(
            12345,
            12346,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            ),
            0x274c4753194d1b181DEd46958F150ec15b5f604b,
            1
        );
    }

    function testStartAfterEndTime() public {
        vm.prank(deployer);
        vm.expectRevert(bytes("Invalid start/end time"));
        registry.addGrandPrix(
            12346,
            12345,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            ),
            0x274c4753194d1b181DEd46958F150ec15b5f604b,
            1
        );
    }

    function testOverlappingTimes() public {
        vm.prank(deployer);
        registry.addGrandPrix(
            12345,
            12346,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            ),
            0x274c4753194d1b181DEd46958F150ec15b5f604b,
            1
        );
        vm.prank(deployer);
        vm.expectRevert(bytes("Invalid start/end time"));
        registry.addGrandPrix(
            12345,
            12360,
            bytes32(
                0x3f494381e86ad92969d331be13aebadb2a7f942a011253b2fa413c5143fa396b
            ),
            0x274c4753194d1b181DEd46958F150ec15b5f604b,
            1
        );
    }
}
