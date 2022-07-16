import React, {Component} from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function Icon (props) {
    return (
        <i className={classnames('fa', 'fa-' + props.type, props.className)} onClick={(e) => {
            props.onClick && props.onClick(e)
        }}
        title={props.title}
        style={{color: props.color}}></i>
    );
};

Icon.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string
};

Icon.defaultProps = {
    onClick: () => {
    },
    type: '',
    title: '',
    color: ''
};
