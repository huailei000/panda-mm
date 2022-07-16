import './index.scss'
import React from 'react';
import PropTypes from 'prop-types';
import Row from './row';
import Column from './Column';

export default class extends React.Component {

    static Row = Row;
    static Column = Column;

    render(){
        return (
            <div className={`x-grid-container`}>
                {this.props.children}
            </div>
        );
    }

}

