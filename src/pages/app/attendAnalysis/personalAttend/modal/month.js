import React, { Component, Fragment } from 'react'
import { BSheet } from 'bcomponents'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classNameArr: props.classArr,
            year: props.month.split('-')[0],
            month: props.month.split('-')[1],
            days: {}
        }
    }

    componentWillMount() {
        this.text();
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(newProps.month) !== JSON.stringify(this.props.month)) {
            this.setState({
                year: newProps.month.split('-')[0],
                month: newProps.month.split('-')[1], 
                classNameArr: newProps.classArr,
                days: {}
            })
        }

        if (this.props.classArr !== newProps.classArr){
            this.setState({
                classNameArr: newProps.classArr,
                days: {}
            }, () => {
                this.text();
            })
        }
    }

    weekConf = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    //当前月份的最后一天
    getThisMonthLastDay(year, month) {
        month = parseInt(month, 10);
        let d = new Date(year, month, 0);
        return d.getDate();
    }

    componentDidMount() {
        this.text();
    };

    text() {
        this.state.classNameArr.forEach((item, index) => {
            let day = item.date.slice(-2)-1;
            this.state.days[`day${day}`] = item
            this.setState({
                days: this.state.days
            })
        });
    }

    render() {
        const { year, month } = this.state;
        //计算当前月第一天星期几
        let firstDate = new Date(year, month - 1, 1).getDay();
        //定义六行七列数组
        let rows = [].fill.call(new Array(6), 0),
            cols = [].fill.call(new Array(7), 0);
        let firIndex = 0,
            endIndex = 0;
        return (
            <div className="personal-attend-week">
                <BSheet>
                    <BSheet.Row>
                        {this.weekConf.map((item, index) => {
                            return (
                                <BSheet.Week val={item} key={`week${index}`} />
                            )
                        })}
                    </BSheet.Row>
                    <Fragment>
                        {rows.map((itemRow, indexRow) => {
                            let itemCol = cols.map((itemCol, indexCol) => {
                                //第一行渲染日期数
                                let indexFirstLine = 7 - firstDate,
                                    index = indexRow * 7 + indexFirstLine;
                                //渲染日历
                                if (indexRow == 0 && indexCol < firstDate) {
                                    return (
                                        <BSheet.Empty tips={ this.getThisMonthLastDay(year,month - 1) - firstDate + indexCol + 1 }
                                            key={`normal${indexRow + indexCol + 1}`} />
                                    )
                                } else if ( indexRow == 0 && indexCol >= firstDate ) { //当月第一行数据
                                    firIndex++;
                                    let dayObj = this.state.days[`day${firIndex-1}`];
                                    return (<BSheet.Normal
                                        val={firIndex}
                                        type={dayObj ? dayObj['nonattendance'] > 0 ? 'red' : '' : 'not'}
                                        site={dayObj ? dayObj['nonattendance'] > 0 ? `缺勤${dayObj['nonattendance']}节` : '全勤' : '暂无记录'}
                                                key={`normal${indexRow + indexCol + 1}`} />)
                                } else if ((indexRow - 1) * 7 + indexCol + 1 + indexFirstLine > this.getThisMonthLastDay(year, month)) {
                                    endIndex++
                                    return (
                                        <BSheet.Empty tips={endIndex} key={`normal${indexRow + indexCol + 1}`} />
                                    )
                                } else {
                                    let dayIndex = (indexRow - 1) * 7 + indexCol + 1 + indexFirstLine,
                                        dayObj = this.state.days[`day${dayIndex - 1}`];
                                    return (
                                        <BSheet.Normal
                                            val={dayIndex}
                                            type={dayObj ? dayObj['nonattendance'] > 0 ? 'red' : '' : 'not'}
                                            site={dayObj ? dayObj['nonattendance'] > 0 ? `缺勤${dayObj['nonattendance']}节` : '全勤' : '暂无记录'}
                                            key={`normal${indexRow + indexCol + 1}`}/>
                                    )
                                }
                            })
                            return (
                                <BSheet.Row key={indexRow + 1}>
                                    {itemCol}
                                </BSheet.Row>
                            )
                        })}
                    </Fragment>
                </BSheet>
            </div>
        )
    }
}
