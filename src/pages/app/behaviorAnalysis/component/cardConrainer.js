import React, { Component } from 'react'
import PropTypes from 'prop-types'

class cardConrainer extends Component {
    constructor(props) {
        super(props)
    }
    static defaultProps = {
        src: require('../../../../assets/avatar.jpg')
    }
    render() {
        return (
            <div className={`CardContainer ${this.props.className}`}>
                <div className="imgContainer">
                    <div className="paddingLayout" />
                    <div className="myImg">
                        <img src={this.props.src} />
                    </div>
                </div>
                <div className="imgAlt">{this.props.children}</div>
            </div>
        )
    }
}

cardConrainer.propTypes = {
    src: PropTypes.string
}

export default cardConrainer
