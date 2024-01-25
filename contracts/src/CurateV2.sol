// SPDX-License-Identifier: MIT

/// @authors: []
/// @reviewers: []
/// @auditors: []
/// @bounties: []

pragma solidity 0.8.18;

import {IArbitrableV2, IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";

/// @title TODO
/// @dev TODO
contract CurateV2 is IArbitrableV2 {
    // ************************************* //
    // *         Enums / Structs           * //
    // ************************************* //

    struct Dispute {
        bool isRuled; // Whether the dispute has been ruled or not.
        uint256 ruling; // Ruling given by the arbitrator.
    }

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    address public immutable governor;
    IArbitratorV2 public arbitrator; // Address of the arbitrator contract.
    bytes public arbitratorExtraData; // Extra data to set up the arbitration.
    IDisputeTemplateRegistry public templateRegistry; // The dispute template registry.
    uint256 public templateId; // The current dispute template identifier.
    mapping(uint256 => uint256) public externalIDtoLocalID; // Maps external (arbitrator side) dispute IDs to local dispute IDs.
    Dispute[] public disputes; // Stores the disputes' info. disputes[disputeID].

    // ************************************* //
    // *              Events               * //
    // ************************************* //

    // TODO

    // ************************************* //
    // *        Function Modifiers         * //
    // ************************************* //

    modifier onlyByGovernor() {
        if (governor != msg.sender) revert GovernorOnly();
        _;
    }

    // ************************************* //
    // *            Constructor            * //
    // ************************************* //

    /// @dev Constructor.
    /// @param _arbitrator The arbitrator of the contract.
    /// @param _arbitratorExtraData Extra data for the arbitrator.
    /// @param _templateData The dispute template data.
    /// @param _templateDataMappings The dispute template data mappings.
    /// @param _templateRegistry The dispute template registry.
    constructor(
        IArbitratorV2 _arbitrator,
        bytes memory _arbitratorExtraData,
        string memory _templateData,
        string memory _templateDataMappings,
        IDisputeTemplateRegistry _templateRegistry
    ) {
        governor = msg.sender;
        arbitrator = _arbitrator;
        arbitratorExtraData = _arbitratorExtraData;
        templateRegistry = _templateRegistry;

        templateId = templateRegistry.setDisputeTemplate("", _templateData, _templateDataMappings);
    }

    // ************************************* //
    // *             Governance            * //
    // ************************************* //

    function changeArbitrator(IArbitratorV2 _arbitrator) external onlyByGovernor {
        arbitrator = _arbitrator;
    }

    function changeArbitratorExtraData(bytes calldata _arbitratorExtraData) external onlyByGovernor {
        arbitratorExtraData = _arbitratorExtraData;
    }

    function changeTemplateRegistry(IDisputeTemplateRegistry _templateRegistry) external onlyByGovernor {
        templateRegistry = _templateRegistry;
    }

    function changeDisputeTemplate(
        string memory _templateData,
        string memory _templateDataMappings
    ) external onlyByGovernor {
        templateId = templateRegistry.setDisputeTemplate("", _templateData, _templateDataMappings);
    }

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Calls createDispute function of the specified arbitrator to create a dispute.
    /// Note that we don’t need to check that msg.value is enough to pay arbitration fees as it’s the responsibility of the arbitrator contract.
    /// @return disputeID Dispute id (on arbitrator side) of the dispute created.
    function createDispute() external payable returns (uint256 disputeID) {
        uint256 numberOfRulingOptions = 2;
        uint256 localDisputeID = disputes.length;
        disputes.push(Dispute({isRuled: false, ruling: 0}));

        disputeID = arbitrator.createDispute{value: msg.value}(numberOfRulingOptions, arbitratorExtraData);
        externalIDtoLocalID[disputeID] = localDisputeID;

        uint256 externalDisputeID = uint256(keccak256(abi.encodePacked("Hello World!")));
        emit DisputeRequest(arbitrator, disputeID, externalDisputeID, templateId, "");
    }

    /// @dev To be called by the arbitrator of the dispute, to declare the winning ruling.
    /// @param _externalDisputeID ID of the dispute in arbitrator contract.
    /// @param _ruling The ruling choice of the arbitration.
    function rule(uint256 _externalDisputeID, uint256 _ruling) external override {
        if (msg.sender != address(arbitrator)) revert ArbitratorOnly();

        uint256 localDisputeID = externalIDtoLocalID[_externalDisputeID];
        Dispute storage dispute = disputes[localDisputeID];
        if (dispute.isRuled) revert DisputeAlreadyResolved();

        dispute.isRuled = true;
        dispute.ruling = _ruling;

        emit Ruling(IArbitratorV2(msg.sender), _externalDisputeID, _ruling);
    }

    // ************************************* //
    // *              Errors               * //
    // ************************************* //

    error GovernorOnly();
    error ArbitratorOnly();
    error DisputeAlreadyResolved();
}
