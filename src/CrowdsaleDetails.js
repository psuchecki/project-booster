import React, {Component} from 'react'
import {Button} from 'react-bootstrap'

import ProjectBoosterCrowdsaleContract from '../build/contracts/ProjectBoosterCrowdsale.json'
import getWeb3 from './utils/getWeb3'

class CrowdsaleDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      contract: null,
      donateAmount: 0,
      raised: 0,
      goal: 0,
      endTime: '',
      donations: 0
    };

    this.donateClick = this.donateClick.bind(this);
    this.handleDonateAmountChange = this.handleDonateAmountChange.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        return this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  formatWei(weiAmount) {
    return this.state.web3.fromWei(weiAmount, "ether").toString();
  }

  formatDate(timeInMillis) {
    var newDate = new Date();
    newDate.setTime(timeInMillis*1000);
    return newDate.toUTCString();
  }

  handleDonateAmountChange(event) {
    this.setState({donateAmount: event.target.value});
  }

  donateClick(e) {
    e.preventDefault();
    var crowdsaleInstance;
    this.state.contract.deployed().then((instance) => {
      crowdsaleInstance = instance

      const weiToSend = this.state.web3.toWei(this.state.donateAmount, "ether");
      const account = this.state.web3.eth.accounts[0];
      return crowdsaleInstance.buyTokens(account, {value: weiToSend, from: account, gas: 20000000});
    }).then((result) => {
      return crowdsaleInstance.weiRaised.call();
    }).then((weiRaised) => {
      return this.setState({raised: this.formatWei(weiRaised)});
    }).then(() => {
      return crowdsaleInstance.goal.call();
    }).then((goal) => {
      return this.setState({goal: this.formatWei(goal)});
    }).catch(function (err) {
      console.log(err.message);
    });
  }


  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const truffleContract = require('truffle-contract')
    const contract = truffleContract(ProjectBoosterCrowdsaleContract)
    contract.setProvider(this.state.web3.currentProvider)
    this.setState({contract: contract});

    // Declaring this for later so we can chain functions on SimpleStorage.
    var crowdsaleInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
        contract.deployed().then((instance) => {
          crowdsaleInstance = instance

          // Stores a given value, 5 by default.
          const weiToSend = this.state.web3.toWei(0.01, "ether");
          const acc = accounts[0];
          return crowdsaleInstance.buyTokens(acc, {value: weiToSend, from: acc, gas: 20000000});
        }).then((result) => {
          return crowdsaleInstance.weiRaised.call();
        }).then((weiRaised) => {
          return this.setState({raised: this.formatWei(weiRaised)});
        }).then(() => {
          return crowdsaleInstance.goal.call();
        }).then((goal) => {
          return this.setState({goal: this.formatWei(goal)});
        }).then(() => {
          return crowdsaleInstance.endTime.call();
        }).then((endTime) => {
          return this.setState({endTime: this.formatDate(endTime)})
        }).then(() => {
          return crowdsaleInstance.donations.call();
        }).then((donations) => {
          return this.setState({donations: this.formatDate(donations)})
        }).catch(function (err) {
          console.log(err.message);
        });
      }
    )
  }

  render() {
    return (
      <div>
        <p>Status</p>
        <p>{this.state.raised} ETH of {this.state.goal} goal</p>
        <p>Fundraising ends at {this.state.endTime}</p>
        <p>{this.state.donations} donations</p>

        <input type="text" onChange={this.handleDonateAmountChange} value={this.state.donateAmount}/>
        <Button onClick={this.donateClick} bsStyle="primary">Donate</Button>
      </div>
    );
  }


}

export default CrowdsaleDetails