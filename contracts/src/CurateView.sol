// SPDX-License-Identifier: MIT

/// @custom:authors: [@unknownunknown1, @mtsalenc*]
/// @custom:reviewers: []
/// @custom:auditors: []
/// @custom:bounties: []
/// @custom:deployments: []

pragma solidity 0.8.18;

import {CurateV2, IArbitratorV2} from "./CurateV2.sol";

/// @title CurateView
/// A view contract to fetch, batch, parse and return Curate contract data efficiently.
/// This contract includes functions that can halt execution due to out-of-gas exceptions. Because of this it should never be relied upon by other contracts.
contract CurateView {
    // ************************************* //
    // *         Enums / Structs           * //
    // ************************************* //
    struct QueryResult {
        bytes32 ID;
        CurateV2.Status status;
        bool disputed;
        bool resolved;
        uint256 disputeID;
        CurateV2.Party ruling;
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

    // Workaround stack too deep limit
    struct ItemData {
        CurateV2.Status status;
        uint256 numberOfRequests;
    }

    // Workaround stack too deep limit
    struct RequestData {
        ItemData item;
        bool disputed;
        uint256 disputeID;
        uint256 submissionTime;
        bool resolved;
        address payable[3] parties;
        CurateV2.Party ruling;
        IArbitratorV2 arbitrator;
        bytes arbitratorExtraData;
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @dev Fetch Curate storage in a single call.
    /// @param _curate The address of the Curate contract to query.
    /// @return result The latest storage data.
    function fetchArbitrable(CurateV2 _curate) external view returns (ArbitrableData memory result) {
        result.governor = _curate.governor();
        result.arbitrator = address(_curate.getArbitrator());
        result.arbitratorExtraData = _curate.getArbitratorExtraData();
        result.relayerContract = _curate.relayerContract();
        result.submissionBaseDeposit = _curate.submissionBaseDeposit();
        result.removalBaseDeposit = _curate.removalBaseDeposit();
        result.submissionChallengeBaseDeposit = _curate.submissionChallengeBaseDeposit();
        result.removalChallengeBaseDeposit = _curate.removalChallengeBaseDeposit();
        result.challengePeriodDuration = _curate.challengePeriodDuration();
        result.templateRegistry = address(_curate.templateRegistry());
        result.templateIdRegistration = _curate.templateIdRegistration();
        result.templateIdRemoval = _curate.templateIdRemoval();
        result.arbitrationCost = IArbitratorV2(result.arbitrator).arbitrationCost(result.arbitratorExtraData);
    }

    /// @dev Fetch the latest data on an item in a single call.
    /// @param _curate The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return result The item data.
    function getItem(CurateV2 _curate, bytes32 _itemID) public view returns (QueryResult memory result) {
        RequestData memory request = getLatestRequestData(_curate, _itemID);
        result = QueryResult({
            ID: _itemID,
            status: request.item.status,
            disputed: request.disputed,
            resolved: request.resolved,
            disputeID: request.disputeID,
            ruling: request.ruling,
            requester: request.parties[uint256(CurateV2.Party.Requester)],
            challenger: request.parties[uint256(CurateV2.Party.Challenger)],
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
    /// @param _curate The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return requests The items requests.
    function getItemRequests(CurateV2 _curate, bytes32 _itemID) external view returns (ItemRequest[] memory requests) {
        ItemData memory itemData = getItemData(_curate, _itemID);
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
            ) = _curate.getRequestInfo(_itemID, i);

            // Sort requests by newest first.
            requests[itemData.numberOfRequests - i - 1] = ItemRequest({
                disputed: disputed,
                disputeID: disputeID,
                submissionTime: submissionTime,
                resolved: resolved,
                requester: parties[uint256(CurateV2.Party.Requester)],
                challenger: parties[uint256(CurateV2.Party.Challenger)],
                arbitrator: address(arbitrator),
                arbitratorExtraData: arbitratorExtraData
            });
        }
    }

    /// @dev Fetch data of the an item and return a struct.
    /// @param _curate The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return item The item data.
    function getItemData(CurateV2 _curate, bytes32 _itemID) public view returns (ItemData memory item) {
        (CurateV2.Status status, uint256 numberOfRequests, ) = _curate.getItemInfo(_itemID);
        item = ItemData(status, numberOfRequests);
    }

    /// @dev Fetch the latest request of an item.
    /// @param _curate The address of the Curate contract to query.
    /// @param _itemID The ID of the item to query.
    /// @return request The request data.
    function getLatestRequestData(CurateV2 _curate, bytes32 _itemID) public view returns (RequestData memory request) {
        ItemData memory item = getItemData(_curate, _itemID);
        (
            bool disputed,
            uint256 disputeID,
            uint256 submissionTime,
            bool resolved,
            address payable[3] memory parties,
            CurateV2.Party ruling,
            IArbitratorV2 arbitrator,
            bytes memory arbitratorExtraData
        ) = _curate.getRequestInfo(_itemID, item.numberOfRequests - 1);
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
