pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
import "./ProjectBoosterToken.sol";


contract ProjectBoosterCrowdsale is CappedCrowdsale, RefundableCrowdsale {

	function ProjectBoosterCrowdsale(uint256 startTime, uint256 endTime, uint256 rate, uint256 goal, uint256 cap, address wallet) public
	CappedCrowdsale(cap)
	FinalizableCrowdsale()
	RefundableCrowdsale(goal)
	Crowdsale(startTime, endTime, rate, wallet) {
		require(goal <= cap);
		donations = 0;
	}

	function buyTokens2(address beneficiary) public payable {
		super.buyTokens(beneficiary);
	}

	function createTokenContract() internal returns (MintableToken) {
		return new ProjectBoosterToken();
	}

}
