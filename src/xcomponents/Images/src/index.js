import React, {Component} from "react";
import PropTypes from 'prop-types';
import avatarImg from 'assets/avatar.jpg';
import './index.scss';

class Image extends React.Component {
    static propTypes = {
        imgUrl: PropTypes.string
    };

    static defaultProps = {
        imgUrl: ''
    };

    render() {
        return (
            <img className="x-images-item" src={this.props.imgUrl} />
        );
    }
}

class Void extends React.Component {

    render() {
        return (
            <span className="x-images-void">
                <img src={avatarImg} />
            </span>
        );
    }
}

export default class extends React.Component {
    static Image = Image;
    static Void = Void;

    constructor(props) {
        super();
    }

    render() { 
        return (
            <div className="x-images">
                {this.props.children}
            </div>
        );
    }
};