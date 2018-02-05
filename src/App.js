import React, {Component} from 'react'

import CampaignImage from './CampaignImage'
import CrowdsaleDetails from './CrowdsaleDetails'
import About from './About'

import {Panel} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {Grid} from 'react-bootstrap'
import {Row} from 'react-bootstrap'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import Boxer from './img/boxer.jpeg'

class App extends Component {

  render() {
    return (
      <div className="App">
        <main className="container">
          <Panel header="Crowdsale Title">
            <Grid>
              <Row>
                <Col xs={14} md={7}>
                  <CampaignImage src={Boxer}/>
                </Col>
                <Col xs={10} md={5}>
                  <CrowdsaleDetails/>
                </Col>
              </Row>
              <Row>
                <About/>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    );
  }
}

export default App
