// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";

/// @title DisputeTemplateRegistryMock
/// A minimal dispute template registry for tests.
contract DisputeTemplateRegistryMock is IDisputeTemplateRegistry {
    uint256 public templates;

    function setDisputeTemplate(
        string memory _templateTag,
        string memory _templateData,
        string memory _templateDataMappings
    ) external override returns (uint256 templateId) {
        templateId = templates++;
        emit DisputeTemplate(templateId, _templateTag, _templateData, _templateDataMappings);
    }
}
