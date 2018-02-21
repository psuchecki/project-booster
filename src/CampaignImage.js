import React, {Component} from 'react'
import {Image} from 'react-bootstrap'

class CampaignImage extends Component {
  render() {
    return (
      <div className="well well-lg">
        <Image src={this.props.src} rounded/>
      </div>
    );
  }
}

export default CampaignImage