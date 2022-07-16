import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export default class extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        src: PropTypes.string
    }

    static defaultProps = {}

    render() {
        const { topContent, bottomContent, type } = this.props
        return (
            <div
                className={`attend-card ${
                    type === 'noClass'
                        ? 'no-class'
                        : type === 'red'
                        ? 'red'
                        : ''
                }`}
            >
                {type === 'noClass' ? (
                    '暂无数据'
                ) : (
                    <Fragment>
                        <div className="top-content">
                            {this.props.topContent}
                        </div>
                        <div className="bottom-content">
                            {this.props.bottomContent}
                        </div>
                    </Fragment>
                )}
            </div>
        )
    }
}
