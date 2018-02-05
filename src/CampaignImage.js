import React, {Component} from 'react'
import {Image} from 'react-bootstrap'

class CampaignImage extends Component {
    render() {
        return <Image src={this.props.src} rounded/>;
    }
}

export default CampaignImage