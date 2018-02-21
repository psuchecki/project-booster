import React, {Component} from 'react'

import CampaignImage from './CampaignImage'
import CrowdsaleDetails from './CrowdsaleDetails'
import About from './About'

import {Panel} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Row} from 'react-bootstrap'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Growth from './img/growth-700x467.jpg'

class App extends Component {

  render() {
    return (
      <div className="App">
          <Panel header="Crowdsale Title">
            <Grid>
              <Row>
                <Col xs={12} md={8}>
                  <CampaignImage src={Growth}/>
                </Col>
                <Col xs={10} md={4}>
                  <CrowdsaleDetails/>
                </Col>
              </Row>
              <Row>
                <About/>
              </Row>
            </Grid>
          </Panel>
      </div>
    );
  }
}

export default App
