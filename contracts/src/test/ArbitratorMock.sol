// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {IArbitratorV2, IArbitrableV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ArbitratorMock
/// A minimal arbitrator for tests: fixed cost, disputes are ruled by calling `giveRuling`.
contract ArbitratorMock is IArbitratorV2 {
    uint256 public cost;
    uint256 public disputeCount;
    mapping(uint256 => IArbitrableV2) public arbitrables;
    mapping(uint256 => uint256) public rulings;

    constructor(uint256 _cost) {
        cost = _cost;
    }

    function createDispute(uint256, bytes calldata) external payable override returns (uint256 disputeID) {
        require(msg.value >= cost, "Not enough ETH to cover arbitration costs.");
        disputeID = ++disputeCount;
        arbitrables[disputeID] = IArbitrableV2(msg.sender);
        emit DisputeCreation(disputeID, IArbitrableV2(msg.sender));
    }

    function createDispute(uint256, bytes calldata, IERC20, uint256) external pure override returns (uint256) {
        revert("Not supported.");
    }

    /// @dev Rules a dispute and relays the ruling to the arbitrable.
    /// @param _disputeID The ID of the dispute.
    /// @param _ruling The ruling.
    function giveRuling(uint256 _disputeID, uint256 _ruling) external {
        IArbitrableV2 arbitrable = arbitrables[_disputeID];
        rulings[_disputeID] = _ruling;
        emit Ruling(arbitrable, _disputeID, _ruling);
        arbitrable.rule(_disputeID, _ruling);
    }

    function arbitrationCost(bytes calldata) external view override returns (uint256) {
        return cost;
    }

    function arbitrationCost(bytes calldata, IERC20) external pure override returns (uint256) {
        revert("Not supported.");
    }

    function currentRuling(
        uint256 _disputeID
    ) external view override returns (uint256 ruling, bool tied, bool overridden) {
        return (rulings[_disputeID], false, false);
    }
}
