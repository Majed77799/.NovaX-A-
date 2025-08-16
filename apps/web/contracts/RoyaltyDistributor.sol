// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract RoyaltyDistributor is PaymentSplitter {
	constructor(address[] memory payees, uint256[] memory shares_) PaymentSplitter(payees, shares_) payable {}
}