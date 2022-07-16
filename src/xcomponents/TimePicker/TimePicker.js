import React from 'react';
import {XInput} from 'xcomponents';

export default class TimePicker extends React.Component {
    constructor(props) {
        super();
        this.hourList = [];
        this.minList = [];
        let hour = props.hour || 0;
        let min = props.min || 0;
        this.state = {
            isActive: false,
            setHour: {label: parseInt(hour) < 10 ? `0${parseInt(hour)}` : hour, value: parseInt(hour)},
            setMin: {label: parseInt(min) < 10 ? `0${parseInt(min)}` : min, value: parseInt(hour)}
        };
        this.handleWinClick = this.handleWinClick.bind(this);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
    }

    handleWinClick(e) {
        let target = e.target;
        let timePickerArea = this.refs.timePickerArea;
        if (!timePickerArea.contains(target)) {
            this.setState({
                isActive: false
            });
        }
    }

    componentDidMount() {
        for (let i = 0; i <= 23; i++) {
            this.hourList.push({label: i < 10 ? `0${i}` : i, value: i});
        }

        for (let i = 0; i <= 59; i++) {
            this.minList.push({label: i < 10 ? `0${i}` : i, value: i});
        }

        // 绑定window事件，用于点击其他区域时候的关闭
        window.addEventListener('click', this.handleWinClick, false);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleWinClick, false);
    }

    selectHour(item) {
        let value = item['value'],
            label = item['label'];
        this.setState({
            setHour: {
                label: label,
                value: parseInt(value)
            }
        }, () => {
            this.props.onChange(`${this.state.setHour.label}:${this.state.setMin.label}`);
        });
    }

    selectMin(item) {
        let value = item['value'],
            label = item['label'];
        this.setState({
            setMin: {
                label: label,
                value: parseInt(value)
            },
            isActive: false
        }, () => {
            this.props.onChange(`${this.state.setHour.label}:${this.state.setMin.label}`);
        });
    }

    focus(e) {
        this.setState({
            isActive: true
        });
    }

    blur(e) {
    }

    render() {
        return (
            <div ref={"timePickerArea"} className="x-time-picker">
                <div className="rtp-header">
                    <XInput
                        onFocus={this.focus.bind(this)}
                        onBlur={this.blur.bind(this)}
                        value={`${this.state.setHour.label}:${this.state.setMin.label}`}
                    />
                </div>
                <div className={this.state.isActive ? "rtp-selector active" : "rtp-selector"}>
                    <ul className="time-hour">
                        {
                            this.hourList.map((item, index) => {
                                return (
                                    <li className={item.value === this.state.setHour.value ? 'selected' : ''}
                                        key={`hour-${index}`}
                                        onClick={this.selectHour.bind(this,item)}
                                        value={item.value}>{item.label}</li>
                                );
                            })
                        }
                    </ul>
                    <ul className="time-min">
                        {
                            this.minList.map((item, index) => {
                                return (
                                    <li className={item.value === this.state.setMin.value ? 'selected' : ''}
                                        key={`min-${index}`}
                                        onClick={this.selectMin.bind(this,item)}
                                        value={item.value}>{item.label}</li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
