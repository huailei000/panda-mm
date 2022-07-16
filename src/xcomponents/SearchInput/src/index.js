import React, {Component} from "react";
import classnames from 'classnames';
import {XIcon} from 'xcomponents';
import './index.scss';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            isSearch: false
        };
    }

    render() {
        const size = this.props.size || 'md';
        return (
            <div className={'x-search-input-box'}>
                <input value={this.state.value} placeholder={this.props.placeholder || '请输入'}
                       className={classnames('x-input', this.props.className, {disabled: this.props.disabled}, 'x-input-' + size)}
                       onChange={(e) => {
                           this.setState({
                               value: e.target.value
                           });
                           if (e.target.value === '') {
                               this.setState({
                                   isSearch: false
                               }, () => {
                                   this.props.onClear ? this.props.onClear() : null;
                               });
                           }
                       }}
                       onKeyDown={(e) => {
                           if (e.keyCode === 13) {
                               this.setState({
                                   isSearch: true
                               }, () => {
                                   this.props.onSearch(this.state.value);
                               });
                           }
                       }}/>
                {
                    this.state.isSearch ?
                        <XIcon type="times-circle" onClick={() => {
                            this.setState({
                                isSearch: false,
                                value: ''
                            }, () => {
                                !this.props.onClear && this.props.onSearch(this.state.value);
                                this.props.onClear && this.props.onClear();
                            });
                        }} aria-hidden="true"></XIcon> :
                        <XIcon type="search" onClick={() => {
                            this.setState({
                                isSearch: this.state.value ? true : false
                            }, () => {
                                this.props.onSearch(this.state.value);
                            });
                        }} aria-hidden="true"></XIcon>
                }
            </div>
        );
    }
}
