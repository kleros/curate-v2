// SPDX-License-Identifier: MIT

/// @custom:authors: [@mtsalenc, @unknownunknown1]
/// @custom:reviewers: []
/// @custom:auditors: []
/// @custom:bounties: []
/// @custom:deployments: []

pragma solidity 0.8.18;

import {CurateV2, IArbitratorV2, EvidenceModule} from "./CurateV2.sol";

/// @title CurateFactory
/// This contract acts as a registry for Curate instances.
contract CurateFactory {
    // ************************************* //
    // *              Events               * //
    // ************************************* //

    /// @dev Emitted when a new Curate contract is deployed using this factory.
    /// @param _address The address of the newly deployed Curate contract.
    event NewList(CurateV2 indexed _address);

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    CurateV2[] public instances;
    address public curate;

    // ************************************* //
    // *            Constructor            * //
    // ************************************* //

    /// @dev Constructor.
    /// @param _curate Address of the Curate contract that is going to be used for each new deployment.
    constructor(address _curate) {
        curate = _curate;
    }

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Deploy the arbitrable curated registry.
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
    /// @param _relayerContract The address of the relay contract to add/remove items directly.
    /// @param _listMetadata Stringified JSON object containing list metadata (title, description, isListOfLists, etc.). Example at :-  https://cloudflare-ipfs.com/ipfs/QmekLsbXtQfm2jJjdeC5TF1cJcr5qxarZ9bhKmCS9s3ebK/list-metadata.json
    function deploy(
        address _governor,
        IArbitratorV2 _arbitrator,
        bytes calldata _arbitratorExtraData,
        EvidenceModule _evidenceModule,
        address _connectedList,
        CurateV2.TemplateRegistryParams calldata _templateRegistryParams,
        uint256[4] calldata _baseDeposits,
        uint256 _challengePeriodDuration,
        address _relayerContract,
        string memory _listMetadata
    ) public {
        CurateV2 instance = clone(curate);
        instance.initialize(
            _governor,
            _arbitrator,
            _arbitratorExtraData,
            _evidenceModule,
            _connectedList,
            CurateV2.TemplateRegistryParams(
                _templateRegistryParams.templateRegistry,
                _templateRegistryParams.registrationTemplateParameters,
                _templateRegistryParams.removalTemplateParameters
            ),
            _baseDeposits,
            _challengePeriodDuration,
            _relayerContract,
            _listMetadata
        );
        instances.push(instance);
        emit NewList(instance);
    }

    /// @notice Adaptation of https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol.
    /// @dev Deploys and returns the address of a clone that mimics the behaviour of `curate`.
    /// @param _implementation Address of the contract to clone.
    /// This function uses the create opcode, which should never revert.
    function clone(address _implementation) internal returns (CurateV2 instance) {
        /// @solidity memory-safe-assembly
        assembly {
            // Cleans the upper 96 bits of the `_implementation` word, then packs the first 3 bytes
            // of the `_implementation` address with the bytecode before the address.
            mstore(0x00, or(shr(0xe8, shl(0x60, _implementation)), 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000))
            // Packs the remaining 17 bytes of `_implementation` with the bytecode after the address.
            mstore(0x20, or(shl(0x78, _implementation), 0x5af43d82803e903d91602b57fd5bf3))
            instance := create(0, 0x09, 0x37)
        }
        require(instance != CurateV2(address(0)), "ERC1167: create failed");
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @return The number of deployed Curate contracts using this factory.
    function count() external view returns (uint256) {
        return instances.length;
    }
}
