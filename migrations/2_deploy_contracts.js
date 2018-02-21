var Crowdsale = artifacts.require("./ProjectBoosterCrowdsale.sol");

const duration = {
  seconds: function(val) { return val},
  minutes: function(val) { return val * this.seconds(60) },
  hours:   function(val) { return val * this.minutes(60) },
  days:    function(val) { return val * this.hours(24) },
  weeks:   function(val) { return val * this.days(7) },
  years:   function(val) { return val * this.days(365)}
};

module.exports = function(deployer, network, accounts) {
  const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + duration.seconds(1);
  const endTime = startTime + duration.minutes(1);
  const wallet = accounts[1];

  const rate = new web3.BigNumber(100);
  const goal = new web3.BigNumber(5000000000000000000);
  const cap = new web3.BigNumber(20000000000000000000);

  deployer.deploy(Crowdsale, startTime, endTime, rate, goal, cap, wallet);
};

