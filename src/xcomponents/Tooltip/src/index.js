/**
 * name:
 * desc:
 * date: 2018/11/19
 * author: kelvin
 */
import React from 'react';
import './index.scss';

class Tip extends React.Component {
    render() {
        return (
            <div className="x-tooltip-tip">
                {this.props.children}
            </div>
        );
    }
}

class Box extends React.Component {
    state = {
        cls: ''
    }

    componentDidMount() {
        let winWidth = document.documentElement.clientWidth;
        let tooltipBox = this.refs.xTooltipBox;
        let tooltipRect = tooltipBox.getBoundingClientRect();
        let cls = 'right';
        if (tooltipRect.right > winWidth - 40) {
            //winWidth - 40 是给一个缓冲返回，防止贴边展示
            cls = 'left';
        }
        this.setState({
            cls: cls
        });
    }

    render() {
        return (
            <div className={`x-tooltip-box ${this.state.cls}`} ref="xTooltipBox">
                {this.props.children}
            </div>
        );
    }
}

export default class extends React.Component {
    static Tip = Tip;
    static Box = Box;

    constructor(props) {
        super();
        this.tip = null;
        this.box = null;
        this.mouseoverTimer = null;
        this.turnOff = props.turnOff;
    }

    componentDidMount() {
        this.tip = this.refs.xTooltip.children[0];
        this.box = this.refs.xTooltip.children[1];

        if (!this.turnOff) {
            this.tip.addEventListener('mouseover', (e) => {
                // 防抖，做一个延时展现
                this.mouseoverTimer = setTimeout(() => {
                    this.box.style.opacity = 1;
                    this.box.style.zIndex = '10000';
                    this.props.onmouseover && this.props.onmouseover();
                }, 200);
            }, false);
    
            this.tip.addEventListener('mouseout', (e) => {
                clearTimeout(this.mouseoverTimer);
                this.box.style.opacity = 0;
                this.box.style.zIndex = '-9999';
                this.props.onmouseout && this.props.onmouseout();
            }, false);
        }
    }

    render() {
        return (
            <div className="x-tooltip" ref={"xTooltip"}>
                {this.props.children}
            </div>
        );
    }
}