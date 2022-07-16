import React, { Component } from 'react';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
        Date.prototype.format = function(format) {
            let o = {
                'M+': this.getMonth() + 1, //month
                'd+': this.getDate(), //day
                'h+': this.getHours(), //hour
                'm+': this.getMinutes(), //minute
                's+': this.getSeconds(), //second
                'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
                S: this.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                    );
                }
            }
            return format;
        };
    }

    toPage(route) {
        this.props.history.$push(route);
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div className="home">
                <div className="title">视课智慧课堂系统</div>
                <div className="time-day">{this.state.date.format('yyyy年MM月dd日')}</div>
                <div className="time-hour">{this.state.date.format('hh:mm:ss')}</div>
                {/* <div className="btn">
                    <div
                        onClick={this.toPage.bind(
                            this,
                            'attendAnalysis/classmateAttend'
                        )}
                    >
                        考勤统计
                    </div>
                    <div
                        className="history"
                        onClick={this.toPage.bind(this, 'historyRecord')}
                    >
                        历史记录
                    </div>
                </div> */}
            </div>
        );
    }
}
