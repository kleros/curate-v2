// SPDX-License-Identifier: MIT

/// @custom:authors: [@mtsalenc*, @unknownunknown1]
/// @custom:reviewers: []
/// @custom:auditors: []
/// @custom:bounties: []
/// @custom:deployments: []

pragma solidity 0.8.18;

import {Curate, IArbitratorV2} from "./CurateV2.sol";

/// @title CurateFactory
/// This contract acts as a registry for Curate instances.
contract CurateFactory {
    // ************************************* //
    // *              Events               * //
    // ************************************* //

    /// @dev Emitted when a new Curate contract is deployed using this factory. TODO: change TCR mentions.
    /// @param _address The address of the newly deployed Curate contract.
    event NewGTCR(Curate indexed _address);

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    Curate[] public instances;
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
    /// @param _arbitrator Arbitrator to resolve potential disputes. The arbitrator is trusted to support appeal periods and not reenter.
    /// @param _arbitratorExtraData Extra data for the trusted arbitrator contract.
    /// @param _connectedTCR The address of the Curate contract that stores related Curate addresses. This parameter can be left empty.
    /// @param _registrationTemplateParameters Template and data mappings json for registration requests.
    /// @param _removalTemplateParameters Template and data mappings json for removal requests.
    /// @param _governor The trusted governor of this contract.
    /// @param _baseDeposits The base deposits for requests/challenges as follows:
    /// - The base deposit to submit an item.
    /// - The base deposit to remove an item.
    /// - The base deposit to challenge a submission.
    /// - The base deposit to challenge a removal request.
    /// @param _challengePeriodDuration The time in seconds parties have to challenge a request.
    /// @param _relayerContract The address of the relay contract to add/remove items directly.
    /// @param _templateRegistry The dispute template registry.
    function deploy(
        IArbitratorV2 _arbitrator,
        bytes calldata _arbitratorExtraData,
        address _connectedTCR,
        string[2] calldata _registrationTemplateParameters,
        string[2] calldata _removalTemplateParameters,
        address _governor,
        uint256[4] calldata _baseDeposits,
        uint256 _challengePeriodDuration,
        address _relayerContract,
        address _templateRegistry
    ) public {
        Curate instance = clone(curate);
        instance.initialize(
            _arbitrator,
            _arbitratorExtraData,
            _connectedTCR,
            _registrationTemplateParameters,
            _removalTemplateParameters,
            _governor,
            _baseDeposits,
            _challengePeriodDuration,
            _relayerContract,
            _templateRegistry
        );
        instances.push(instance);
        emit NewGTCR(instance);
    }

    /// @notice Adaptation of https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol.
    /// @dev Deploys and returns the address of a clone that mimics the behaviour of `curate`.
    /// @param _implementation Address of the contract to clone.
    /// This function uses the create opcode, which should never revert.
    function clone(address _implementation) internal returns (Curate instance) {
        /// @solidity memory-safe-assembly
        assembly {
            // Cleans the upper 96 bits of the `_implementation` word, then packs the first 3 bytes
            // of the `_implementation` address with the bytecode before the address.
            mstore(0x00, or(shr(0xe8, shl(0x60, _implementation)), 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000))
            // Packs the remaining 17 bytes of `_implementation` with the bytecode after the address.
            mstore(0x20, or(shl(0x78, _implementation), 0x5af43d82803e903d91602b57fd5bf3))
            instance := create(0, 0x09, 0x37)
        }
        require(instance != Curate(address(0)), "ERC1167: create failed");
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @return The number of deployed Curate contracts using this factory.
    function count() external view returns (uint256) {
        return instances.length;
    }
}
