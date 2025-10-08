// SPDX-License-Identifier: MIT

/// @custom:authors: [@unknownunknown1, @mtsalenc, @hbarcelos]
/// @custom:reviewers: []
/// @custom:auditors: []
/// @custom:bounties: []
/// @custom:deployments: []

pragma solidity 0.8.24;

import {IArbitrableV2, IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import {EvidenceModule} from "@kleros/kleros-v2-contracts/arbitration/evidence/EvidenceModule.sol";
import "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";

/// @title Curate
/// Curated registry contract compatible with V2. The V1 version is here https://github.com/kleros/tcr/blob/master/contracts/LightGeneralizedTCR.sol
contract CurateV2 is IArbitrableV2 {
    // ************************************* //
    // *         Enums / Structs           * //
    // ************************************* //

    enum Status {
        Absent, // The item is not in the registry.
        Registered, // The item is in the registry.
        RegistrationRequested, // The item has a request to be added to the registry.
        ClearingRequested // The item has a request to be removed from the registry.
    }

    enum Party {
        None, // Party per default when there is no challenger or requester. Also used for unconclusive ruling.
        Requester, // Party that made the request to change a status.
        Challenger // Party that challenges the request to change a status.
    }

    enum RequestType {
        Registration, // Identifies a request to register an item to the registry.
        Clearing // Identifies a request to remove an item from the registry.
    }

    enum DisputeStatus {
        None, // No dispute was created.
        AwaitingRuling, // Dispute was created, but the final ruling was not given yet.
        Resolved // Dispute was ruled.
    }

    struct Item {
        Status status; // The current status of the item.
        uint256 sumDeposit; // The total deposit made by the requester and the challenger (if any).
        uint256 requestCount; // The number of requests.
        mapping(uint256 => Request) requests; // List of status change requests made for the item in the form requests[requestID].
    }

    struct Request {
        RequestType requestType;
        uint64 submissionTime; // Time when the request was made. Used to track when the challenge period ends.
        uint24 arbitrationParamsIndex; // The index for the arbitration params for the request.
        address payable requester; // Address of the requester.
        // Pack the requester together with the other parameters, as they are written in the same request.
        address payable challenger; // Address of the challenger, if any.
        // TODO: store templateRegistry in case it's changed?
    }

    struct DisputeData {
        uint256 disputeID; // The ID of the dispute on the arbitrator.
        DisputeStatus status; // The current status of the dispute.
        Party ruling; // The ruling given to a dispute.
    }

    struct ArbitrationParams {
        IArbitratorV2 arbitrator; // The arbitrator trusted to solve disputes for this request.
        bytes arbitratorExtraData; // The extra data for the trusted arbitrator of this request.
    }

    struct TemplateRegistryParams {
        address templateRegistry; // Dispute Template registry address
        string[2] registrationTemplateParameters; // Template and data mappings json for registration requests.
        string[2] removalTemplateParameters; // Template and data mappings json for removal requests.
    }

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    bool private initialized;
    uint256 public constant RULING_OPTIONS = 2; // The amount of non 0 choices the arbitrator can give.
    address public relayerContract; // The contract that is used to add or remove items directly to speed up the interchain communication.
    address public governor; // The address that can make changes to the parameters of the contract.
    IDisputeTemplateRegistry public templateRegistry; // The dispute template registry.
    uint256 public templateIdRegistration; // The current dispute template identifier for registration requests.
    uint256 public templateIdRemoval; // The current dispute template identifier for removal requests.
    uint256 public submissionBaseDeposit; // The base deposit to submit an item.
    uint256 public removalBaseDeposit; // The base deposit to remove an item.
    uint256 public submissionChallengeBaseDeposit; // The base deposit to challenge a submission.
    uint256 public removalChallengeBaseDeposit; // The base deposit to challenge a removal request.
    uint256 public challengePeriodDuration; // The time after which a request becomes executable if not challenged.

    mapping(bytes32 => Item) public items; // Maps the item ID to its data in the form items[_itemID].
    mapping(address => mapping(uint256 => bytes32)) public arbitratorDisputeIDToItemID; // Maps a dispute ID to the ID of the item with the disputed request in the form arbitratorDisputeIDToItemID[arbitrator][disputeID].
    mapping(bytes32 => mapping(uint256 => DisputeData)) public requestsDisputeData; // Maps an item and a request to the data of the dispute related to them. requestsDisputeData[itemID][requestIndex]
    ArbitrationParams[] public arbitrationParamsChanges;

    // ************************************* //
    // *        Function Modifiers         * //
    // ************************************* //

    modifier onlyGovernor() {
        require(msg.sender == governor, "The caller must be the governor.");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayerContract, "The caller must be the relay.");
        _;
    }

    // ************************************* //
    // *              Events               * //
    // ************************************* //

    /// @dev Emitted when a party makes a request, raises a dispute or when a request is resolved.
    /// @param _itemID The ID of the affected item.
    /// @param _updatedDirectly Whether this was emitted in either `addItemDirectly` or `removeItemDirectly`. This is used in the subgraph.
    event ItemStatusChange(bytes32 indexed _itemID, bool _updatedDirectly);

    /// @dev Emitted when someone submits an item for the first time.
    /// @param _itemID The ID of the new item.
    /// @param _data Stringified JSON Object containing item data. Example at :- https://cloudflare-ipfs.com/ipfs/QmTypFX9416z5V87Fsnf6A89rrskh2X8BSVdaKhwzXNiDb/item.json.
    /// @param _addedDirectly Whether the item was added via `addItemDirectly`.
    event NewItem(bytes32 indexed _itemID, string _data, bool _addedDirectly);

    /// @dev Emitted when someone submits a request.
    /// @param _itemID The ID of the affected item.
    /// @param _requestID Unique dispute identifier within this contract.
    /// @param _evidence Stringified evidence object, example: '{"name" : "Justification", "description" : "Description", "fileURI" : "/ipfs/QmWQV5ZFFhEJiW8Lm7ay2zLxC2XS4wx1b2W7FfdrLMyQQc"}'.
    event RequestSubmitted(bytes32 indexed _itemID, uint256 _requestID, string _evidence);

    /// @dev Emitted when someone challenges a request.
    /// @param _itemID The ID of the affected item.
    /// @param _requestID Unique dispute identifier within this contract.
    /// @param _evidence Stringified evidence object, example: '{"name" : "Justification", "description" : "Description", "fileURI" : "/ipfs/QmWQV5ZFFhEJiW8Lm7ay2zLxC2XS4wx1b2W7FfdrLMyQQc"}'.
    event RequestChallenged(bytes32 indexed _itemID, uint256 _requestID, string _evidence);

    /// @dev Emitted when the address of the connected Curate contract is set. The Curate is an instance of the Curate contract where each item is the address of a Curate contract related to this one.
    /// @param _connectedList The address of the connected Curate.
    event ConnectedListSet(address indexed _connectedList);

    /// @dev Emitted when the list metadata ipfs uri is updated.
    /// @param _listMetadata Ipfs uri to list metadata.
    event ListMetadataSet(string _listMetadata);

    // ************************************* //
    // *            Initializer            * //
    // ************************************* //

    /// @dev Initialize the arbitrable curated registry.
    /// @param _governor The trusted governor of this contract.
    /// @param _arbitrator Arbitrator to resolve potential disputes. The arbitrator is trusted to support appeal periods and not reenter.
    /// @param _arbitratorExtraData Extra data for the trusted arbitrator contract.
    /// @param _evidenceModule The evidence contract for the arbitrator.
    /// @param _connectedList The address of the Curate contract that stores related Curate addresses. This parameter can be left empty.
    /// @param _templateRegistryParams The dispute template registry.
    /// - templateRegistry : The dispute template registry.
    /// - registrationTemplateParameters : Template and data mappings json for registration requests.
    /// - removalTemplateParameters : Template and data mappings json for removal requests.
    /// @param _baseDeposits The base deposits for requests/challenges as follows:
    /// - The base deposit to submit an item.
    /// - The base deposit to remove an item.
    /// - The base deposit to challenge a submission.
    /// - The base deposit to challenge a removal request.
    /// @param _challengePeriodDuration The time in seconds parties have to challenge a request.
    /// @param _relayerContract The address of the relayer contract to add/remove items directly.
    /// @param _listMetadata Stringified JSON object containing list metadata (title, description, isListOfLists, etc.). Example at :-  https://cloudflare-ipfs.com/ipfs/QmekLsbXtQfm2jJjdeC5TF1cJcr5qxarZ9bhKmCS9s3ebK/list-metadata.json
    function initialize(
        address _governor,
        IArbitratorV2 _arbitrator,
        bytes calldata _arbitratorExtraData,
        EvidenceModule _evidenceModule,
        address _connectedList,
        TemplateRegistryParams calldata _templateRegistryParams,
        uint256[4] calldata _baseDeposits,
        uint256 _challengePeriodDuration,
        address _relayerContract,
        string calldata _listMetadata
    ) external {
        require(!initialized, "Already initialized.");
        initialized = true;

        governor = _governor;
        submissionBaseDeposit = _baseDeposits[0];
        removalBaseDeposit = _baseDeposits[1];
        submissionChallengeBaseDeposit = _baseDeposits[2];
        removalChallengeBaseDeposit = _baseDeposits[3];
        challengePeriodDuration = _challengePeriodDuration;
        relayerContract = _relayerContract;

        templateRegistry = IDisputeTemplateRegistry(_templateRegistryParams.templateRegistry);
        templateIdRegistration = templateRegistry.setDisputeTemplate(
            "Registration",
            _templateRegistryParams.registrationTemplateParameters[0],
            _templateRegistryParams.registrationTemplateParameters[1]
        );
        templateIdRemoval = templateRegistry.setDisputeTemplate(
            "Removal",
            _templateRegistryParams.removalTemplateParameters[0],
            _templateRegistryParams.removalTemplateParameters[1]
        );

        arbitrationParamsChanges.push(
            ArbitrationParams({arbitrator: _arbitrator, arbitratorExtraData: _arbitratorExtraData})
        );

        if (_connectedList != address(0)) {
            emit ConnectedListSet(_connectedList);
        }

        emit ListMetadataSet(_listMetadata);
    }

    // ************************************* //
    // *             Governance            * //
    // ************************************* //

    /// @dev Change the duration of the challenge period.
    /// @param _challengePeriodDuration The new duration of the challenge period.
    function changeChallengePeriodDuration(uint256 _challengePeriodDuration) external onlyGovernor {
        challengePeriodDuration = _challengePeriodDuration;
    }

    /// @dev Change the base amount required as a deposit to submit an item.
    /// @param _submissionBaseDeposit The new base amount of wei required to submit an item.
    function changeSubmissionBaseDeposit(uint256 _submissionBaseDeposit) external onlyGovernor {
        submissionBaseDeposit = _submissionBaseDeposit;
    }

    /// @dev Change the base amount required as a deposit to remove an item.
    /// @param _removalBaseDeposit The new base amount of wei required to remove an item.
    function changeRemovalBaseDeposit(uint256 _removalBaseDeposit) external onlyGovernor {
        removalBaseDeposit = _removalBaseDeposit;
    }

    /// @dev Change the base amount required as a deposit to challenge a submission.
    /// @param _submissionChallengeBaseDeposit The new base amount of wei required to challenge a submission.
    function changeSubmissionChallengeBaseDeposit(uint256 _submissionChallengeBaseDeposit) external onlyGovernor {
        submissionChallengeBaseDeposit = _submissionChallengeBaseDeposit;
    }

    /// @dev Change the base amount required as a deposit to challenge a removal request.
    /// @param _removalChallengeBaseDeposit The new base amount of wei required to challenge a removal request.
    function changeRemovalChallengeBaseDeposit(uint256 _removalChallengeBaseDeposit) external onlyGovernor {
        removalChallengeBaseDeposit = _removalChallengeBaseDeposit;
    }

    /// @dev Change the governor of the curated registry.
    /// @param _governor The address of the new governor.
    function changeGovernor(address _governor) external onlyGovernor {
        governor = _governor;
    }

    /// @dev Change the address of connectedList, the Curate instance that stores addresses of Curate contracts related to this one.
    /// @param _connectedList The address of the connectedList contract to use.
    function changeConnectedList(address _connectedList) external onlyGovernor {
        emit ConnectedListSet(_connectedList);
    }

    /// @dev Update list metadata ipfs uri.
    /// @param _listMetadata Ipfs uri to list metadata
    function changeListMetadata(string calldata _listMetadata) external onlyGovernor {
        emit ListMetadataSet(_listMetadata);
    }

    /// @dev Change the address of the relay contract.
    /// @param _relayerContract The new address of the relay contract.
    function changeRelayerContract(address _relayerContract) external onlyGovernor {
        relayerContract = _relayerContract;
    }

    /// @dev Changes the address of Template Registry contract.
    /// @param _templateRegistry The new template registry.
    function changeTemplateRegistry(IDisputeTemplateRegistry _templateRegistry) external onlyGovernor {
        templateRegistry = _templateRegistry;
        // TODO: automatically set templates upon changing the registry.
    }

    /// @dev Changes the dispute template for registration requests.
    /// @param _templateData The new template data for registration requests.
    /// @param _templateDataMappings The new data mappings json for registration requests.
    function changeRegistrationDisputeTemplate(
        string memory _templateData,
        string memory _templateDataMappings
    ) external onlyGovernor {
        templateIdRegistration = templateRegistry.setDisputeTemplate(
            "Registration",
            _templateData,
            _templateDataMappings
        );
    }

    /// @dev Changes the dispute template for removal requests.
    /// @param _templateData The new template data for removal requests.
    /// @param _templateDataMappings The new data mappings json for removal requests.
    function changeRemovalDisputeTemplate(
        string memory _templateData,
        string memory _templateDataMappings
    ) external onlyGovernor {
        templateIdRemoval = templateRegistry.setDisputeTemplate("Removal", _templateData, _templateDataMappings);
    }

    /// @notice Changes the params related to arbitration.
    /// @param _arbitrator Arbitrator to resolve potential disputes. The arbitrator is trusted to support appeal periods and not reenter.
    /// @param _arbitratorExtraData Extra data for the trusted arbitrator contract.
    /// @param _evidenceModule The evidence module for the arbitrator.
    function changeArbitrationParams(
        IArbitratorV2 _arbitrator,
        bytes calldata _arbitratorExtraData,
        EvidenceModule _evidenceModule
    ) external onlyGovernor {
        arbitrationParamsChanges.push(
            ArbitrationParams({arbitrator: _arbitrator, arbitratorExtraData: _arbitratorExtraData})
        );
    }

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Directly add an item to the list bypassing request-challenge. Can only be used by the relayer contract.
    /// @param _item Stringified JSON Object containing Item data
    function addItemDirectly(string calldata _item) external onlyRelayer {
        bytes32 itemID = keccak256(abi.encodePacked(_item));
        Item storage item = items[itemID];
        require(item.status == Status.Absent, "Item must be absent to be added.");

        // Note that if the item is added directly once, the next time it is added it will emit this event again.
        if (item.requestCount == 0) {
            emit NewItem(itemID, _item, true);
        }

        item.status = Status.Registered;

        emit ItemStatusChange(itemID, true);
    }

    /// @dev Directly remove an item from the list bypassing request-challenge. Can only be used by the relayer contract.
    /// @param _itemID The ID of the item to remove. Example at :- https://cloudflare-ipfs.com/ipfs/QmTypFX9416z5V87Fsnf6A89rrskh2X8BSVdaKhwzXNiDb/item.json
    function removeItemDirectly(bytes32 _itemID) external onlyRelayer {
        Item storage item = items[_itemID];
        require(item.status == Status.Registered, "Item must be registered to be removed.");

        item.status = Status.Absent;

        emit ItemStatusChange(_itemID, true);
    }

    /// @dev Submit a request to register an item. Accepts enough ETH to cover the deposit, reimburses the rest.
    /// @param _item Stringified JSON object containing item data. Example at :- https://cloudflare-ipfs.com/ipfs/QmTypFX9416z5V87Fsnf6A89rrskh2X8BSVdaKhwzXNiDb/item.json
    function addItem(string calldata _item) external payable {
        bytes32 itemID = keccak256(abi.encodePacked(_item));
        Item storage item = items[itemID];

        require(item.status == Status.Absent, "Item must be absent to be added.");

        // Note that if the item was added previously using `addItemDirectly`, the event will be emitted again here.
        if (item.requestCount == 0) {
            emit NewItem(itemID, _item, false);
        }

        Request storage request = item.requests[item.requestCount++];
        uint256 arbitrationParamsIndex = arbitrationParamsChanges.length - 1;
        IArbitratorV2 arbitrator = arbitrationParamsChanges[arbitrationParamsIndex].arbitrator;
        bytes storage arbitratorExtraData = arbitrationParamsChanges[arbitrationParamsIndex].arbitratorExtraData;

        uint256 arbitrationCost = arbitrator.arbitrationCost(arbitratorExtraData);
        uint256 totalCost = arbitrationCost + submissionBaseDeposit;
        require(msg.value >= totalCost, "You must fully fund the request.");

        item.sumDeposit = totalCost;
        item.status = Status.RegistrationRequested;

        request.requestType = RequestType.Registration;
        request.submissionTime = uint64(block.timestamp);
        request.arbitrationParamsIndex = uint24(arbitrationParamsIndex);
        request.requester = payable(msg.sender);

        emit RequestSubmitted(itemID, getRequestID(itemID, item.requestCount - 1), "");

        if (msg.value > totalCost) {
            payable(msg.sender).send(msg.value - totalCost);
        }
    }

    /// @dev Submit a request to remove an item from the list. Accepts enough ETH to cover the deposit, reimburses the rest.
    /// @param _itemID The ID of the item to remove.
    /// @param _evidence Stringified evidence object, example: '{"name" : "Justification", "description" : "Description", "fileURI" : "/ipfs/QmWQV5ZFFhEJiW8Lm7ay2zLxC2XS4wx1b2W7FfdrLMyQQc"}'.
    function removeItem(bytes32 _itemID, string calldata _evidence) external payable {
        Item storage item = items[_itemID];

        require(item.status == Status.Registered, "Item must be registered to be removed.");

        Request storage request = item.requests[item.requestCount++];
        uint256 arbitrationParamsIndex = arbitrationParamsChanges.length - 1;
        ArbitrationParams storage arbitrationParams = arbitrationParamsChanges[arbitrationParamsIndex];
        IArbitratorV2 arbitrator = arbitrationParams.arbitrator;

        uint256 arbitrationCost = arbitrator.arbitrationCost(arbitrationParams.arbitratorExtraData);
        uint256 totalCost = arbitrationCost + removalBaseDeposit;
        require(msg.value >= totalCost, "You must fully fund the request.");

        item.sumDeposit = totalCost;
        item.status = Status.ClearingRequested;

        request.submissionTime = uint64(block.timestamp);
        request.arbitrationParamsIndex = uint24(arbitrationParamsIndex);
        request.requester = payable(msg.sender);
        request.requestType = RequestType.Clearing;

        uint256 requestID = getRequestID(_itemID, item.requestCount - 1);
        emit RequestSubmitted(_itemID, requestID, _evidence);

        if (msg.value > totalCost) {
            payable(msg.sender).send(msg.value - totalCost);
        }
    }

    /// @dev Challenges the request of the item. Accepts enough ETH to cover the deposit, reimburses the rest.
    /// @param _itemID The ID of the item which request to challenge.
    /// @param _evidence Stringified evidence object, example: '{"name" : "Justification", "description" : "Description", "fileURI" : "/ipfs/QmWQV5ZFFhEJiW8Lm7ay2zLxC2XS4wx1b2W7FfdrLMyQQc"}'.
    function challengeRequest(bytes32 _itemID, string calldata _evidence) external payable {
        Item storage item = items[_itemID];
        require(item.status > Status.Registered, "The item must have a pending request.");

        uint256 lastRequestIndex = item.requestCount - 1;
        Request storage request = item.requests[lastRequestIndex];
        require(
            block.timestamp - request.submissionTime <= challengePeriodDuration,
            "Challenges must occur during the challenge period."
        );

        DisputeData storage disputeData = requestsDisputeData[_itemID][lastRequestIndex];
        require(disputeData.status == DisputeStatus.None, "The request should not have already been disputed.");

        ArbitrationParams storage arbitrationParams = arbitrationParamsChanges[request.arbitrationParamsIndex];
        IArbitratorV2 arbitrator = arbitrationParams.arbitrator;

        uint256 arbitrationCost = arbitrator.arbitrationCost(arbitrationParams.arbitratorExtraData);
        uint256 totalCost;
        {
            uint256 challengerBaseDeposit = item.status == Status.RegistrationRequested
                ? submissionChallengeBaseDeposit
                : removalChallengeBaseDeposit;
            totalCost = arbitrationCost + challengerBaseDeposit;
        }
        require(msg.value >= totalCost, "You must fully fund the challenge.");

        item.sumDeposit = item.sumDeposit + totalCost - arbitrationCost;

        request.challenger = payable(msg.sender);

        // Raise a dispute.
        disputeData.disputeID = arbitrator.createDispute{value: arbitrationCost}(
            RULING_OPTIONS,
            arbitrationParams.arbitratorExtraData
        );
        disputeData.status = DisputeStatus.AwaitingRuling;

        arbitratorDisputeIDToItemID[address(arbitrator)][disputeData.disputeID] = _itemID;

        uint256 requestID = getRequestID(_itemID, lastRequestIndex);
        emit RequestChallenged(_itemID, requestID, _evidence);

        uint256 templateId = request.requestType == RequestType.Registration
            ? templateIdRegistration
            : templateIdRemoval;
        emit DisputeRequest(arbitrator, disputeData.disputeID, requestID, templateId, "");

        if (msg.value > totalCost) {
            payable(msg.sender).send(msg.value - totalCost);
        }
    }

    /// @dev Executes an unchallenged request if the challenge period has passed.
    /// @param _itemID The ID of the item to execute.
    function executeRequest(bytes32 _itemID) external {
        Item storage item = items[_itemID];
        uint256 lastRequestIndex = items[_itemID].requestCount - 1;

        Request storage request = item.requests[lastRequestIndex];
        require(
            block.timestamp - request.submissionTime > challengePeriodDuration,
            "Time to challenge the request must pass."
        );

        DisputeData storage disputeData = requestsDisputeData[_itemID][lastRequestIndex];
        require(disputeData.status == DisputeStatus.None, "The request should not be disputed.");

        if (item.status == Status.RegistrationRequested) {
            item.status = Status.Registered;
        } else if (item.status == Status.ClearingRequested) {
            item.status = Status.Absent;
        } else {
            revert("There must be a request.");
        }

        emit ItemStatusChange(_itemID, false);

        uint256 sumDeposit = item.sumDeposit;
        item.sumDeposit = 0;

        if (sumDeposit > 0) {
            // reimburse the requester
            request.requester.send(sumDeposit);
        }
    }

    /// @dev Give a ruling for a dispute. Can only be called by the arbitrator. TRUSTED.
    /// @param _disputeID ID of the dispute in the arbitrator contract.
    /// @param _ruling Ruling given by the arbitrator. Note that 0 is reserved for "Refused to arbitrate".
    function rule(uint256 _disputeID, uint256 _ruling) external {
        require(_ruling <= RULING_OPTIONS, "Invalid ruling option");

        bytes32 itemID = arbitratorDisputeIDToItemID[msg.sender][_disputeID];
        Item storage item = items[itemID];
        uint256 lastRequestIndex = items[itemID].requestCount - 1;
        Request storage request = item.requests[lastRequestIndex];

        DisputeData storage disputeData = requestsDisputeData[itemID][lastRequestIndex];
        require(disputeData.status == DisputeStatus.AwaitingRuling, "The request must not be resolved.");

        ArbitrationParams storage arbitrationParams = arbitrationParamsChanges[request.arbitrationParamsIndex];
        require(address(arbitrationParams.arbitrator) == msg.sender, "Only the arbitrator can give a ruling");

        emit Ruling(IArbitratorV2(msg.sender), _disputeID, _ruling);

        Party winner = Party(_ruling);

        disputeData.status = DisputeStatus.Resolved;
        disputeData.ruling = winner;

        uint256 sumDeposit = item.sumDeposit;
        item.sumDeposit = 0;

        if (winner == Party.None) {
            // If the arbitrator refuse to rule, then the item status should be the same it was before the request.
            // Regarding item.status this is equivalent to the challenger winning the dispute.
            item.status = item.status == Status.RegistrationRequested ? Status.Absent : Status.Registered;

            // Since nobody has won, then we reimburse both parties equally.
            // If item.sumDeposit is odd, 1 wei will remain in the contract balance.
            uint256 halfSumDeposit = sumDeposit / 2;

            request.requester.send(halfSumDeposit);
            request.challenger.send(halfSumDeposit);
        } else if (winner == Party.Requester) {
            item.status = item.status == Status.RegistrationRequested ? Status.Registered : Status.Absent;

            request.requester.send(sumDeposit);
        } else {
            item.status = item.status == Status.RegistrationRequested ? Status.Absent : Status.Registered;

            request.challenger.send(sumDeposit);
        }

        emit ItemStatusChange(itemID, false);
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @notice Gets the local dispute ID for a given item and request.
    /// @param _itemID The ID of the item.
    /// @param _requestID The ID of the request.
    /// @return Local dispute ID.
    function getRequestID(bytes32 _itemID, uint256 _requestID) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_itemID, _requestID)));
    }

    /// @notice Gets the arbitrator for new requests.
    /// @dev Gets the latest value in arbitrationParamsChanges.
    /// @return The arbitrator address.
    function getArbitrator() external view returns (IArbitratorV2) {
        return arbitrationParamsChanges[arbitrationParamsChanges.length - 1].arbitrator;
    }

    /// @notice Gets the arbitratorExtraData for new requests.
    /// @dev Gets the latest value in arbitrationParamsChanges.
    /// @return The arbitrator extra data.
    function getArbitratorExtraData() external view returns (bytes memory) {
        return arbitrationParamsChanges[arbitrationParamsChanges.length - 1].arbitratorExtraData;
    }

    /// @dev Returns item's information. Includes the total number of requests for the item
    /// @param _itemID The ID of the queried item.
    /// @return status The current status of the item.
    /// @return numberOfRequests Total number of requests for the item.
    /// @return sumDeposit The total deposit made by the requester and the challenger (if any)
    function getItemInfo(
        bytes32 _itemID
    ) external view returns (Status status, uint256 numberOfRequests, uint256 sumDeposit) {
        Item storage item = items[_itemID];
        return (item.status, item.requestCount, item.sumDeposit);
    }

    /// @dev Gets information on a request made for the item.
    /// @param _itemID The ID of the queried item.
    /// @param _requestID The request to be queried.
    /// @return disputed True if a dispute was raised.
    /// @return disputeID ID of the dispute, if any.
    /// @return submissionTime Time when the request was made.
    /// @return resolved True if the request was executed and/or any raised disputes were resolved.
    /// @return parties Address of requester and challenger, if any.
    /// @return ruling The final ruling given, if any.
    /// @return requestArbitrator The arbitrator trusted to solve disputes for this request.
    /// @return requestArbitratorExtraData The extra data for the trusted arbitrator of this request.
    function getRequestInfo(
        bytes32 _itemID,
        uint256 _requestID
    )
        external
        view
        returns (
            bool disputed,
            uint256 disputeID,
            uint256 submissionTime,
            bool resolved,
            address payable[3] memory parties,
            Party ruling,
            IArbitratorV2 requestArbitrator,
            bytes memory requestArbitratorExtraData
        )
    {
        Item storage item = items[_itemID];
        require(item.requestCount > _requestID, "Request does not exist.");

        Request storage request = items[_itemID].requests[_requestID];

        submissionTime = request.submissionTime;
        parties[uint256(Party.Requester)] = request.requester;
        parties[uint256(Party.Challenger)] = request.challenger;

        (disputed, disputeID, ruling) = getRequestDisputeData(_itemID, _requestID);

        (requestArbitrator, requestArbitratorExtraData) = getRequestArbitrationParams(_itemID, _requestID);
        resolved = getRequestResolvedStatus(_itemID, _requestID);
    }

    /// @dev Gets the dispute data relative to a given item request.
    /// @param _itemID The ID of the queried item.
    /// @param _requestID The request to be queried.
    /// @return disputed True if a dispute was raised.
    /// @return disputeID ID of the dispute, if any.
    /// @return ruling The final ruling given, if any.
    function getRequestDisputeData(
        bytes32 _itemID,
        uint256 _requestID
    ) internal view returns (bool disputed, uint256 disputeID, Party ruling) {
        DisputeData storage disputeData = requestsDisputeData[_itemID][_requestID];

        return (disputeData.status >= DisputeStatus.AwaitingRuling, disputeData.disputeID, disputeData.ruling);
    }

    /// @dev Gets the arbitration params relative to a given item request.
    /// @param _itemID The ID of the queried item.
    /// @param _requestID The request to be queried.
    /// @return arbitrator The arbitrator trusted to solve disputes for this request.
    /// @return arbitratorExtraData The extra data for the trusted arbitrator of this request.
    function getRequestArbitrationParams(
        bytes32 _itemID,
        uint256 _requestID
    ) internal view returns (IArbitratorV2 arbitrator, bytes memory arbitratorExtraData) {
        Request storage request = items[_itemID].requests[_requestID];
        ArbitrationParams storage arbitrationParams = arbitrationParamsChanges[request.arbitrationParamsIndex];

        return (arbitrationParams.arbitrator, arbitrationParams.arbitratorExtraData);
    }

    /// @dev Gets the resovled status of a given item request.
    /// @param _itemID The ID of the queried item.
    /// @param _requestID The request to be queried.
    /// @return resolved True if the request was executed and/or any raised disputes were resolved.
    function getRequestResolvedStatus(bytes32 _itemID, uint256 _requestID) internal view returns (bool resolved) {
        Item storage item = items[_itemID];

        if (item.requestCount == 0) {
            return false;
        }

        if (_requestID < item.requestCount - 1) {
            // It was resolved because it is not the last request.
            return true;
        }

        return item.sumDeposit == 0;
    }
}
