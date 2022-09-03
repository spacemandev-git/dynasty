// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract Registry {
    event GrandPrixAdded(bytes32 indexed configHash);
    event GrandPrixDeleted(bytes32 indexed configHash);

    struct GrandPrixMetadata {
        uint256 startTime;
        uint256 endTime;
        bytes32 configHash;
        // Address of first map with this config. Future maps will be created from this
        address parentAddress;
        uint256 seasonId;
    }

    address public contractOwner;

    mapping(bytes32 => GrandPrixMetadata) public configHashToMetadata;
    mapping(address => bool) public isAdmin;
    // Array to iterate on GrandPrix
    GrandPrixMetadata[] public grandPrixList;
    address[] public admins;

    constructor() {
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
        require(admin != address(0), "Can't add zero address");
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

    function getAllGrandPrix()
        public
        view
        returns (GrandPrixMetadata[] memory)
    {
        return grandPrixList;
    }

    function setContractOwner(address newOwner) public onlyContractOwner {
        require(newOwner != address(0), "Owner cannot be zero address");
        contractOwner = newOwner;
    }

    function addGrandPrix(
        uint256 startTime,
        uint256 endTime,
        bytes32 configHash,
        address parentAddress,
        uint256 seasonId
    ) public onlyAdmin {
        require(
            _validateGrandPrixTime(startTime, endTime),
            "Invalid start/end time"
        );
        require(
            parentAddress != address(0),
            "Parent address cannot be zero address"
        );
        configHashToMetadata[configHash] = GrandPrixMetadata(
            startTime,
            endTime,
            configHash,
            parentAddress,
            seasonId
        );
        grandPrixList.push(configHashToMetadata[configHash]);
        emit GrandPrixAdded(configHash);
    }

    function deleteRound(bytes32 _configHash) public onlyAdmin {
        for (uint256 i = 0; i < grandPrixList.length; i++) {
            if (grandPrixList[i].configHash == _configHash) {
                delete configHashToMetadata[_configHash];
                delete grandPrixList[i];
                emit GrandPrixDeleted(_configHash);
                break;
            }
        }
    }

    function _validateGrandPrixTime(uint256 _startTime, uint256 _endTime)
        internal
        view
        returns (bool)
    {
        bool startBeforeEnd = _startTime < _endTime;
        bool noOverlap = true;
        for (uint256 i = 0; i < grandPrixList.length; i++) {
            if (
                grandPrixList[i].startTime < _endTime &&
                grandPrixList[i].endTime > _startTime
            ) {
                noOverlap = false;
                break;
            }
        }
        return startBeforeEnd && noOverlap;
    }
}
