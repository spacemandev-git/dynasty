// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

import "solmate/tokens/ERC721.sol";
import "forge-std/console.sol";

error MintPriceNotPaid();
error MaxSupply();
error NonExistentTokenURI();
error WithdrawTransfer();
error InvalidURI();

contract NFT is ERC721 {
    uint256 public currentTokenId;
    mapping(uint256 => string) tokenURIs;

    address public contractOwner;

    mapping(address => bool) public isAdmin;
    address[] public admins;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        contractOwner = msg.sender;
        isAdmin[msg.sender] = true;
        admins.push(msg.sender);
    }

    /*
	    Access Control
	*/

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not admin");
        _;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Not contract owner");
        _;
    }

    function setAdmin(address admin, bool allowed) public onlyContractOwner {
        if (allowed) {
            // check if admin is already in admins array
            if (!isAdmin[admin]) {
                admins.push(admin);
            }
        } else {
            for (uint256 i = 0; i < admins.length; i++) {
                if (admins[i] == admin) {
                    delete admins[i];
                    break;
                }
            }
        }
        isAdmin[admin] = allowed;
    }

    function getAllAdmins() public view returns (address[] memory) {
        return admins;
    }

    function mintTo(address recipient, string memory _tokenURI)
        public
        payable
        onlyAdmin
        returns (uint256)
    {
        if (bytes(_tokenURI).length == 0) revert InvalidURI();

        uint256 newTokenId = ++currentTokenId;
        tokenURIs[newTokenId] = _tokenURI;
        _safeMint(recipient, newTokenId);
        return newTokenId;
    }

    function bulkMintTo(address[] memory recipients, string memory _tokenURI)
        public
        payable
        onlyAdmin
        returns (uint256[] memory)
    {
        uint256[] memory tokenIds = new uint[](recipients.length);

        if (bytes(_tokenURI).length == 0) revert InvalidURI();
        for(uint256 i; i < recipients.length; i++) {
            uint256 newTokenId = ++currentTokenId;
            tokenURIs[newTokenId] = _tokenURI;
            _safeMint(recipients[i], newTokenId);
            tokenIds[i] = newTokenId;
        }

        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (ownerOf(tokenId) == address(0)) {
            revert NonExistentTokenURI();
        }
        return tokenURIs[tokenId];
    }
    function bulkTokenURI(uint256[] memory tokenIds)
        public
        view
        returns (string[] memory)
    {
        string[] memory tokenURIList = new string[](tokenIds.length);
        for(uint256 i = 0; i < tokenIds.length; i++) {
            tokenURIList[i] = tokenURI(tokenIds[i]);
        }
        return tokenURIList;
    }
    
    function bulkOwner(uint256[] memory tokenIds)
        public
        view
        returns (address[] memory)
    {
        address[] memory ownerList = new address[](tokenIds.length);
        for(uint256 i = 0; i < tokenIds.length; i++) {
            ownerList[i] = ownerOf(tokenIds[i]);
        }
        return ownerList;
    }

}
