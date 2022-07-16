import './index.scss'
import React from 'react';
import PropTypes from 'prop-types';
/**
 * @name
 * @params
 * @description
 * @author
 */
export default class Component extends React.Component {
    static propTypes = {}

    static defaultProps = {}

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <footer className="xcomponent-footer">
                <span>北京旷视科技有限公司 Copyright 2018</span>
            </footer>
        );
    }
}