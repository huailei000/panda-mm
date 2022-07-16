import React, { Component, Fragment } from 'react'
import {
    XInput,
    XSelector,
    XButton,
    XModal,
    XImages,
    XTab,
    XTabPane,
    XIcon,
    XToggle,
} from 'xcomponents'
import { BSheet, BNoData, BLoading } from 'bcomponents'
import { $_ajax, $_date, $_conf, $_toast } from 'services'
import MonthScan from './month'
import WeekScan from './week'

export default class extends Component {
    constructor(props) {
        super(props)
        const M = (new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : (new Date().getMonth() + 1)
        this.state = {
            classArr: [],
            activeIndex: 0,
            selectMonth: new Date().getFullYear() + '-' + M,
            selectWeek: $_date.getThisFullWeek(new Date()),
            name: props.data.type.student.name,
            job_number: props.data.type.student.job_number,
            photos: props.data.type.student.photos && props.data.type.student.photos.length > 0 ? props.data.type.student.photos[0].url : '',
            hasCourse: false,
            person: [],
            termIndex: 0,
            termToggle: false,
            termList: [{ name: '', id: '' }],
            isLoading: false,
        } // id: props.data.list.id,
    }

    componentDidMount() {
        this.getTerms()
    }

    initData(term_id = null) {
        this.setState({
            isLoading: true,
        })
        $_ajax.getMock('attendance/student', {
                name: this.state.name,
                job_number: this.state.job_number,
                term_id: this.state.term_id ? this.state.term_id : term_id,
                start_time:
                    this.state.activeIndex == 1
                        ? this.state.selectMonth + '-01'
                        : $_date.init('YYYY-MM-DD', this.state.selectWeek[0]),
                end_time:
                    this.state.activeIndex == 1
                        ? this.state.selectMonth +
                          '-' +
                          $_date.getThisMonthLastDay(
                              this.state.selectMonth.split('-')[0],
                              this.state.selectMonth.split('-')[1]
                          )
                        : $_date.init('YYYY-MM-DD', this.state.selectWeek[6])
            })
            .then(res => {
                if (res.data.list.length === 0) {
                    this.setState({
                       hasCourse: false,
                       isLoading: false,
                       classArr: [],
                    })
                    return;
                }
                this.setState(
                    {
                        classArr: res.data.list,
                        person: res.data,
                        hasCourse: true,
                        isLoading: false,
                    },
                    () => {
                        
                    }
                )
            }).catch(err => {
                this.setState({
                    hasCourse: false,
                    isLoading: false
                })
                $_toast(err.desc);
            })
    }

    monthChange(index) {
        const { selectMonth } = this.state
        let month = selectMonth.split('-')[1],
            year = selectMonth.split('-')[0]
        let nowDate = new Date(year, Number(month) + index - 1, 1)
        this.setState(
            { selectMonth: $_date.init('YYYY-MM', nowDate) },
            () => { this.initData() }
        )
    }

    weekChange(index) {
        const { selectWeek } = this.state
        let year = selectWeek[0].getFullYear(),
            month = selectWeek[0].getMonth(),
            date = selectWeek[0].getDate()
        this.setState(
            {
                selectWeek: $_date.getThisFullWeek(
                    new Date(year, month, date + index)
                )
            },
            () => {
                this.initData()
            }
        )
    }

    // 获取学年列表
    getTerms() {
        let termList = []
        let yearList = []
        $_ajax.get('info/terms').then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        termList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.term_year} ${item.term}`
                            })
                        )
                        yearList.push(item)
                    })
                yearList = Array.from(new Set(yearList))
                termList = Array.from(new Set(termList)).map(item => {
                    return JSON.parse(item)
                })
                this.setState({
                    yearList: yearList,
                    termList: termList,
                    term_id: termList[0].id
                })
                this.initData(termList[0].id)
            },
            res => {
                this.initData()
                $_toast(res.desc)
            }
        )
    }

    itemTermClick(obj, index) {
        this.setState({
            termIndex: index,
            term_id: obj.id
        })
    }

    changeTerm() {
        this.setState({
            termToggle: !this.state.termToggle
        })
    }

    // 选择菜单关闭
    closeToggleBox(type) {
        this.setState({
            [`${type}Toggle`]: false
        })
    }

    render() {
        const { confirm, cancel, data } = this.props
        const { hasCourse, classArr } = this.state;
        return (
            <div className="personal-attend-scan">
                <XModal.Header {...this.props}>
                    个人考勤统计分析详情
                </XModal.Header>
                <XModal.Body>
                    <div className="scan-basic">
                        <div className="left-info">
                            <div className="item">
                                {
                                    this.state.photos == '' ? (
                                        <XImages.Void />
                                    ): (
                                            
                                        <XImages>
                                            <XImages.Image
                                                imgUrl={this.state.photos}
                                            />
                                        </XImages>
                                    )
                                }
                            </div>
                            <div className="item bottom30">
                                <span className="name">{this.state.name}</span>
                            </div>
                            <div className="item">
                                <span className="title">学号</span>
                                <span className="value">
                                    {this.state.job_number}
                                </span>
                            </div>
                            <div className="item bottom40">
                                <span className="title">班级</span>
                                <span className="value">
                                    {
                                        this.state.person.cls ? this.state.person.cls.name : ''
                                    }
                                </span>
                            </div>
                            <div className="item">
                                <span className="title">考勤学期</span>
                                <span className="value">
                                    {this.state.termList.length > 0
                                        ? this.state.termList[
                                              this.state.termIndex
                                          ].name
                                        : null}
                                </span>
                            </div>
                            <div className="item bottom50">
                                <span className="title">查询周期</span>
                                <span className="value">
                                {
                                    this.state.activeIndex == 0
                                        ? `${$_date.init('YYYY-MM-DD', this.state.selectWeek[0])} - ${$_date.init('YYYY-MM-DD',this.state.selectWeek[6])}`
                                        : this.state.selectMonth

                                }
                                </span>
                            </div>
                            <div className="item statistics">
                                查询周期缺勤次数
                                <span className='red'>
                                    { this.state.hasCourse ? this.state.person.nonattendance : 0 }
                                </span>{' '}次
                            </div>
                            <div className="item statistics">
                                本学期缺勤次数
                                <span className='red'>
                                    {this.state.hasCourse ? this.state.person.term_nonattendance: 0}
                                </span>{' '}次
                            </div>
                            <div className="item temp">
                                <span>到课</span>
                                <BSheet>
                                    <BSheet.Row>
                                        <BSheet.Normal
                                            val={this.state.activeIndex === 0 ? '课程名称' : '日期'}
                                            site={this.state.activeIndex === 0 ? '首次抓拍时间' : '全勤'}
                                        />
                                    </BSheet.Row>
                                </BSheet>
                            </div>
                            <div className="item temp">
                                <span>缺勤</span>
                                <BSheet>
                                    <BSheet.Row>
                                        <BSheet.Normal
                                            type={'red'}
                                            val={this.state.activeIndex === 0 ? '课程名称' : '日期'}
                                            site={this.state.activeIndex === 0 ? '任课教师' : '缺勤节数'}
                                        />
                                    </BSheet.Row>
                                </BSheet>
                            </div>
                            {this.state.activeIndex !== 0 ? < div className = "item temp" >
                                <span>暂无记录</span>
                                <BSheet>
                                    <BSheet.Row>
                                        <BSheet.Normal
                                            val={'日期'}
                                            site={'暂无记录'}
                                            type={'not'}
                                        />
                                    </BSheet.Row>
                                </BSheet>
                            </div> : null}
                        </div>
                        <div className="right-info">
                            <div
                                className="term-list"
                                onClick={this.changeTerm.bind(this)}
                            >
                                <XToggle
                                    onClose={this.closeToggleBox.bind(
                                        this,
                                        'term'
                                    )}
                                >
                                    <XToggle.Top>
                                        <span className="info">
                                            {
                                                this.state.termList[
                                                    parseInt(
                                                        this.state.termIndex
                                                    )
                                                ].name
                                            }
                                        </span>
                                        <XIcon
                                            type="caret-down"
                                            className={`icon-toggle ${
                                                this.state.termToggle
                                                    ? 'up-icon'
                                                    : ''
                                            }`}
                                        />
                                    </XToggle.Top>
                                    <XToggle.Box>
                                        <div className="search-content">
                                            {this.state.termList.map(
                                                (child, i) => {
                                                    return (
                                                        <div
                                                            key={`term${i}`}
                                                            onClick={this.itemTermClick.bind(
                                                                this,
                                                                child,
                                                                i
                                                            )}
                                                            className={`${
                                                                i ===
                                                                this.state
                                                                    .termIndex
                                                                    ? 'active'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {child.name}
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </XToggle.Box>
                                </XToggle>
                            </div>
                            <XTab
                                classPrefix={'tabs'}
                                defaultActiveIndex={0}
                                className="tab-wrapper "
                                onChange={data => {
                                    if (data.activeIndex == this.state.activeIndex) return;
                                    if (data.activeIndex == 1) {
                                        this.setState(
                                            {
                                                activeIndex: 1
                                            },
                                            () => {
                                                this.initData()
                                            }
                                        )
                                    }
                                    if (data.activeIndex == 0) {
                                        this.setState(
                                            {
                                                activeIndex: 0
                                            },
                                            () => {
                                                this.initData()
                                            }
                                        )
                                    }
                                }}
                            >
                                <XTabPane
                                    key={`tab_0`}
                                    order={'0'}
                                    className="seeTab"
                                    tab={
                                        this.state.activeIndex == 0 ? (
                                            <div>
                                                <XIcon
                                                    type={'caret-left'}
                                                    onClick={this.weekChange.bind(
                                                        this,
                                                        -7
                                                    )}
                                                />
                                                {$_date.init(
                                                    'MM.DD',
                                                    this.state.selectWeek[0]
                                                ) +
                                                    '-' +
                                                    $_date.init(
                                                        'MM.DD',
                                                        this.state.selectWeek[6]
                                                    )}
                                                <XIcon
                                                    type={'caret-right'}
                                                    onClick={this.weekChange.bind(
                                                        this,
                                                        7
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            '按周查看'
                                        )
                                    }
                                >
                                    {this.state.isLoading
                                        ? <BLoading type="table"></BLoading>
                                        : this.state.hasCourse ? (
                                            <WeekScan
                                                week={this.state.selectWeek}
                                                classArr={this.state.classArr}
                                            />
                                        ) : <BNoData></BNoData>
                                    }
                                </XTabPane>
                                <XTabPane
                                    key={`tab_1`}
                                    order={'1'}
                                    className="seeTab"
                                    tab={
                                        this.state.activeIndex == 1 ? (
                                            <div>
                                                <XIcon
                                                    type={'caret-left'}
                                                    onClick={this.monthChange.bind(
                                                        this,
                                                        -1
                                                    )}
                                                />
                                                {this.state.selectMonth}
                                                <XIcon
                                                    type={'caret-right'}
                                                    onClick={this.monthChange.bind(
                                                        this,
                                                        1
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            '按月查看'
                                        )
                                    }
                                >
                                    {this.state.isLoading
                                      ?< BLoading type = "table"></BLoading>
                                      :this.state.hasCourse ? (
                                        <MonthScan
                                            month={this.state.selectMonth}
                                            classArr={this.state.classArr}
                                        />
                                    ): <BNoData></BNoData>}
                                </XTabPane>
                            </XTab>
                        </div>
                    </div>
                </XModal.Body>
            </div>
        )
    }
}
