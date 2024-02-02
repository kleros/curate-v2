// SPDX-License-Identifier: MIT

/// @custom:authors: [@unknownunknown1, @mtsalenc*]
/// @custom:reviewers: []
/// @custom:auditors: []
/// @custom:bounties: []
/// @custom:deployments: []

pragma solidity 0.8.18;

import {Curate, IArbitratorV2} from "./CurateV2.sol";

/// @title CurateView
/// A view contract to fetch, batch, parse and return Curate contract data efficiently.
/// This contract includes functions that can halt execution due to out-of-gas exceptions. Because of this it should never be relied upon by other contracts.
contract CurateView {
    struct QueryResult {
        bytes32 ID;
        Curate.Status status;
        bool disputed;
        bool resolved;
        uint256 disputeID;
        Curate.Party ruling;
        address requester;
        address challenger;
        address arbitrator;
        bytes arbitratorExtraData;
        uint256 submissionTime;
        uint256 numberOfRequests;
    }

    struct ArbitrableData {
        address governor;
        address arbitrator;
        bytes arbitratorExtraData;
        address relayerContract;
        uint256 submissionBaseDeposit;
        uint256 removalBaseDeposit;
        uint256 submissionChallengeBaseDeposit;
        uint256 removalChallengeBaseDeposit;
        uint256 challengePeriodDuration;
        address templateRegistry;
        uint256 templateIdRegistration;
        uint256 templateIdRemoval;
        uint256 arbitrationCost;
    }

    /// @dev Fetch Curate storage in a single call.
    /// @param _address The address of the Curate contract to query.
    /// @return result The latest storage data.
    function fetchArbitrable(address _address) external view returns (ArbitrableData memory result) {
        Curate curate = Curate(_address);
        result.governor = curate.governor();
        result.arbitrator = address(curate.getArbitrator());
        result.arbitratorExtraData = curate.getArbitratorExtraData();
        result.relayerContract = curate.relayerContract();
        result.submissionBaseDeposit = curate.submissionBaseDeposit();
        result.removalBaseDeposit = curate.removalBaseDeposit();
        result.submissionChallengeBaseDeposit = curate.submissionChallengeBaseDeposit();
        result.removalChallengeBaseDeposit = curate.removalChallengeBaseDeposit();
        result.challengePeriodDuration = curate.challengePeriodDuration();
        result.templateRegistry = address(curate.templateRegistry());
        result.templateIdRegistration = curate.templateIdRegistration();
        result.templateIdRemoval = curate.templateIdRemoval();
        result.arbitrationCost = IArbitratorV2(result.arbitrator).arbitrationCost(result.arbitratorExtraData);
    }

    /// @dev Fetch the latest data on an item in a single call.
    /// @param _address The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return result The item data.
    function getItem(address _address, bytes32 _itemID) public view returns (QueryResult memory result) {
        RequestData memory request = getLatestRequestData(_address, _itemID);
        result = QueryResult({
            ID: _itemID,
            status: request.item.status,
            disputed: request.disputed,
            resolved: request.resolved,
            disputeID: request.disputeID,
            ruling: request.ruling,
            requester: request.parties[uint256(Curate.Party.Requester)],
            challenger: request.parties[uint256(Curate.Party.Challenger)],
            arbitrator: address(request.arbitrator),
            arbitratorExtraData: request.arbitratorExtraData,
            submissionTime: request.submissionTime,
            numberOfRequests: request.item.numberOfRequests
        });
    }

    struct ItemRequest {
        bool disputed;
        uint256 disputeID;
        uint256 submissionTime;
        bool resolved;
        address requester;
        address challenger;
        address arbitrator;
        bytes arbitratorExtraData;
    }

    /// @dev Fetch all requests for an item.
    /// @param _address The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return requests The items requests.
    function getItemRequests(address _address, bytes32 _itemID) external view returns (ItemRequest[] memory requests) {
        Curate curate = Curate(_address);
        ItemData memory itemData = getItemData(_address, _itemID);
        requests = new ItemRequest[](itemData.numberOfRequests);
        for (uint256 i = 0; i < itemData.numberOfRequests; i++) {
            (
                bool disputed,
                uint256 disputeID,
                uint256 submissionTime,
                bool resolved,
                address payable[3] memory parties,
                ,
                IArbitratorV2 arbitrator,
                bytes memory arbitratorExtraData
            ) = curate.getRequestInfo(_itemID, i);

            // Sort requests by newest first.
            requests[itemData.numberOfRequests - i - 1] = ItemRequest({
                disputed: disputed,
                disputeID: disputeID,
                submissionTime: submissionTime,
                resolved: resolved,
                requester: parties[uint256(Curate.Party.Requester)],
                challenger: parties[uint256(Curate.Party.Challenger)],
                arbitrator: address(arbitrator),
                arbitratorExtraData: arbitratorExtraData
            });
        }
    }

    // Functions and structs below used mainly to avoid stack limit.
    struct ItemData {
        Curate.Status status;
        uint256 numberOfRequests;
    }

    struct RequestData {
        ItemData item;
        bool disputed;
        uint256 disputeID;
        uint256 submissionTime;
        bool resolved;
        address payable[3] parties;
        Curate.Party ruling;
        IArbitratorV2 arbitrator;
        bytes arbitratorExtraData;
    }

    /// @dev Fetch data of the an item and return a struct.
    /// @param _address The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return item The item data.
    function getItemData(address _address, bytes32 _itemID) public view returns (ItemData memory item) {
        Curate curate = Curate(_address);
        (Curate.Status status, uint256 numberOfRequests, ) = curate.getItemInfo(_itemID);
        item = ItemData(status, numberOfRequests);
    }

    /// @dev Fetch the latest request of an item.
    /// @param _address The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return request The request data.
    function getLatestRequestData(address _address, bytes32 _itemID) public view returns (RequestData memory request) {
        Curate curate = Curate(_address);
        ItemData memory item = getItemData(_address, _itemID);
        (
            bool disputed,
            uint256 disputeID,
            uint256 submissionTime,
            bool resolved,
            address payable[3] memory parties,
            Curate.Party ruling,
            IArbitratorV2 arbitrator,
            bytes memory arbitratorExtraData
        ) = curate.getRequestInfo(_itemID, item.numberOfRequests - 1);
        request = RequestData(
            item,
            disputed,
            disputeID,
            submissionTime,
            resolved,
            parties,
            ruling,
            arbitrator,
            arbitratorExtraData
        );
    }
}