pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract ProjectBoosterToken is MintableToken {

	string public constant name = "ProjectBoosterToken";
	string public constant symbol = "PBT";
	uint8 public constant decimals = 2;

	uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

	/**
	 * @dev Constructor that gives msg.sender all of existing tokens.
	 */
	function ProjectBoosterToken() public {
		totalSupply = INITIAL_SUPPLY;
		balances[msg.sender] = INITIAL_SUPPLY;
	}

}
