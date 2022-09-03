// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    using stdStorage for StdStorage;

    NFT private nft;
    string private tokenURI = "wee";
    address public deployer = address(69);

    function setUp() public {
        payable(deployer).transfer(100 ether);

        vm.startPrank(deployer);
        // Deploy NFT contract
        nft = new NFT("NFT_tutorial", "TUT");
    }

    function testURI() public {
        uint256 tokenId = nft.mintTo(address(1),tokenURI);
        assertEq("wee", nft.tokenURI(tokenId));
    }

    function testMintNoPrice() public {
        nft.mintTo(address(1),tokenURI);
    }

    function testFailMintToZeroAddress() public {
        nft.mintTo{value: 0.08 ether}(address(0),tokenURI);
    }

    function testNewMintOwnerRegistered() public {
        nft.mintTo{value: 0.08 ether}(address(2),tokenURI);
        uint256 slotOfNewOwner = stdstore
            .target(address(nft))
            .sig(nft.ownerOf.selector)
            .with_key(1)
            .find();

        uint160 ownerOfTokenIdOne = uint160(
            uint256(
                (vm.load(address(nft), bytes32(abi.encode(slotOfNewOwner))))
            )
        );
        assertEq(address(ownerOfTokenIdOne), address(2),tokenURI);
    }

    function testBalanceIncremented() public {
        nft.mintTo{value: 0.08 ether}(address(2),tokenURI);
        uint256 balanceFirstMint = nft.balanceOf(address(2));
        assertEq(balanceFirstMint, 1);

        nft.mintTo{value: 0.08 ether}(address(2),tokenURI);
        uint256 balanceSecondMint = nft.balanceOf(address(2));
        assertEq(balanceSecondMint, 2);

        uint256[] memory args = new uint256[](2);

        args[0] = nft.currentTokenId() - 1;
        args[1] = nft.currentTokenId();
        string[] memory res = new string[](args.length);
        res = nft.bulkTokenURI(args);
        for(uint i = 0; i < args.length; i++) {
            console.log("uri", res[i]);
            assertEq(nft.tokenURI(args[i]),res[i]);
        }
    }

   function testBulkMint() public {
        address[] memory recipients = new address[](3);
        recipients[0] = address(5);
        recipients[1] = address(5);
        recipients[2] = address(5);
        nft.bulkMintTo(recipients, tokenURI);
        uint256 balanceFirstMint = nft.balanceOf(address(5));
        assertEq(balanceFirstMint, 3);
    }

    function testSafeContractReceiver() public {
        Receiver receiver = new Receiver();
        nft.mintTo{value: 0.08 ether}(address(receiver),tokenURI);
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(receiver))
            .find();

        uint256 balance = uint256(vm.load(address(nft), bytes32(slotBalance)));
        assertEq(balance, 1);
    }

    function testFailUnSafeContractReceiver() public {
        vm.etch(address(1), bytes("mock code"));
        nft.mintTo{value: 0.08 ether}(address(1),tokenURI);
    }

}

contract Receiver is ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

