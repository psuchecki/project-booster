import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import {Circle} from 'rc-progress';

import ProjectBoosterCrowdsaleContract from '../build/contracts/ProjectBoosterCrowdsale.json'
import RefundVaultContract from '../build/contracts/RefundVault.json'
import getWeb3 from './utils/getWeb3'

class CrowdsaleDetails extends Component {
  colorMap = ['#FE8C6A', '#3FC7FA', '#85D262'];
  crowdsaleStates = ['ACTIVE', 'REFUNDING', 'CLOSED'];

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      contract: null,
      refundVaultContract: null,
      donateAmount: 0,
      raised: 0,
      goal: 0,
      cap: 0,
      endTime: '',
      crowdsaleState: ''
    };

    this.donateClick = this.donateClick.bind(this);
    this.refundClick = this.refundClick.bind(this);
    this.handleDonateAmountChange = this.handleDonateAmountChange.bind(this);
    this.endCrowdSale = this.endCrowdSale.bind(this);
  }


  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      });
      return this.instantiateContract();
    }).then(() => {
      return this.initEvents();
    }).then(() => {
      return this.setCrowdsaleTimeout();
    }).then(() => {
      return this.refreshState();
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const truffleContract = require('truffle-contract')
    const contract = truffleContract(ProjectBoosterCrowdsaleContract)
    const refundVaultContract = truffleContract(RefundVaultContract)
    contract.setProvider(this.state.web3.currentProvider)
    refundVaultContract.setProvider(this.state.web3.currentProvider)

    this.setState({contract: contract, refundVaultContract: refundVaultContract});
  }

  async initEvents() {
    const crowdsaleInstance = await this.state.contract.deployed();
    const vaultAddr = await crowdsaleInstance.vault.call();
    const refundVault = this.state.refundVaultContract.at(vaultAddr);
    const allEvents = refundVault.allEvents({fromBlock: 0, toBlock: 'latest'});

    allEvents.watch((error, result) => {
      this.refreshState();
    });
  }

  async setCrowdsaleTimeout() {
    const crowdsaleInstance = await this.state.contract.deployed();
    const endTime = this.toDate(await crowdsaleInstance.endTime.call());
    const diff = endTime.getTime() - new Date().getTime();
    const endCrowdsaleTimeout = Math.max(diff, 0);

    setTimeout(this.endCrowdSale, endCrowdsaleTimeout + 1000);
  }

  async endCrowdSale() {
    const crowdsaleInstance = await this.state.contract.deployed();
    const isFinalized = await crowdsaleInstance.isFinalized.call();

    if (!isFinalized) {
      const account = this.state.web3.eth.accounts[0];
      crowdsaleInstance.finalize({from: account});
    }
  }

  async refreshState() {
    var crowdsaleInstance = await this.state.contract.deployed();
    const weiRaised = await crowdsaleInstance.weiRaised.call();
    const goal = await crowdsaleInstance.goal.call();
    const cap = await crowdsaleInstance.cap.call();
    const endTime = await crowdsaleInstance.endTime.call();
    const vaultAddr = await crowdsaleInstance.vault.call();
    const refundVault = this.state.refundVaultContract.at(vaultAddr);
    const crowdsaleState = await refundVault.state.call();

    this.setState({
      raised: this.formatWei(weiRaised),
      goal: this.formatWei(goal),
      cap: this.formatWei(cap),
      endTime: this.formatDate(endTime),
      crowdsaleState: crowdsaleState
    });
  }

  formatWei(weiAmount) {
    return this.state.web3.fromWei(weiAmount, "ether").toString();
  }

  formatDate(timeInMillis) {
    return this.toDate(timeInMillis).toUTCString();
  }

  toDate(timeInMillis) {
    var newDate = new Date();
    newDate.setTime(timeInMillis * 1000);

    return newDate;
  }

  handleDonateAmountChange(event) {
    this.setState({donateAmount: event.target.value});
  }

  async donateClick(e) {
    e.preventDefault();
    const crowdsaleInstance = await this.state.contract.deployed();
    const account = this.state.web3.eth.accounts[0];
    const weiToSend = this.state.web3.toWei(this.state.donateAmount, "ether");
    await crowdsaleInstance.buyTokens(account, {value: weiToSend, from: account, gas: 20000000});
    this.refreshState();
  }

  async refundClick(e) {
    e.preventDefault();
    const crowdsaleInstance = await this.state.contract.deployed();
    const account = this.state.web3.eth.accounts[0];

    crowdsaleInstance.claimRefund({from: account});
  }

  render() {
    const percentage = this.state.raised * 100 / this.state.goal;
    const color = this.colorMap[Math.floor(Math.min(percentage, 100) / 34)];

    const crowdsaleState = this.crowdsaleStates[this.state.crowdsaleState];
    const isRefunding = (crowdsaleState  === 'REFUNDING');
    const isActive = (crowdsaleState  === 'ACTIVE');
    const isClosed = (crowdsaleState  === 'CLOSED');

    return (
      <div className="well well-lg">
        {isClosed ? <p style={{color: 'green', fontSize: 'large'}}>Crowdsale has successfully raised funds!</p> : ""}
        {isRefunding ? <p style={{color: 'orangered', fontSize: 'large'}}>Goal not reached. Refunding enabled.</p> : ""}
        <p>Status: {crowdsaleState}</p>
        <p style={{width: '100px'}}>
          <Circle strokeLinecap="square" percent={percentage} strokeWidth={4} strokeColor={color}/>
        </p>
        <p>{percentage} % raised so far.</p>
        <p>{this.state.raised} ETH of {this.state.goal} goal ({this.state.cap} max)</p>
        {isActive ? <p>Fundraising ends at {this.state.endTime}</p> : "" }
        <p><input style={{width: '100%'}} disabled={!isActive} type="number" min="0" onChange={this.handleDonateAmountChange} value={this.state.donateAmount}/></p>
        <p><Button style={{width: '100%'}} disabled={!isActive} onClick={this.donateClick} bsStyle="primary">Donate</Button></p>
        {isRefunding ? <p><Button style={{width: '100%'}} onClick={this.refundClick} bsStyle="danger">Refund</Button></p> : ""}
      </div>
    );
  }

}

export default CrowdsaleDetails