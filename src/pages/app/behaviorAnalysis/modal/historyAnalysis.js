import React, { Component, Fragment } from 'react'
import { XInput, XButton, XModal, XDatePickerInput, XSelector, XPagination } from 'xcomponents'
import { BNoData } from 'bcomponents';
import CardContainer from '../component/cardConrainer';
import GrounpBtn from '../component/grounpBtn';
import { $_toast, $_date, $_conf } from 'services';
import Api from '../services'
// import behaviorAnalysisHis from '../mock/getBehaviorAnalysisHis';
export default class extends Component {
    constructor(props) {
        super(props)
        this.pages = {
            page: 1,
            size: 50,
        }
        this.selectOpt = {
            emoticon: [
                {
                    label: '全部类别',
                    value: 0,
                },
                {
                    label: '高兴',
                    value: 81,
                },
                {
                    label: '困惑',
                    value: 84
                },
                {
                    label: '愤怒',
                    value: 87
                },
                {
                    label: '难过',
                    value: 83,
                },
                {
                    label: '惊讶',
                    value: 86,
                },
                {
                    label: '厌恶',
                    value: 88
                },
                {
                    label: '害怕',
                    value: 85
                },
            ],
            behaviour: [
                {
                    label: '全部类别',
                    value: 0,
                },
                {
                    label: '站立',
                    value: 22,
                },
                {
                    label: '举手',
                    value: 23,
                },
                {
                    label: '书写',
                    value: 26,
                },
                {
                    label: '阅读',
                    value: 25,
                },
                {
                    label: '趴桌子',
                    value: 21,
                },
                {
                    label: '玩手机',
                    value: 24,
                }
            ],
        }
        const { value, type, params } = props.data;
        const defaultType = type === 0 ? 'emoticon' : 'behaviour';
        const dafualtValue = value;
        this.state = {
            pages: this.pages,
            count: 1,
            current: type || 0,
            tabType: [{
                name: '表情识别',
                key: 'emoticon',
                value: 3,
            }, {
                name: '行为识别',
                key: 'behaviour',
                value: 2
            }],
            defaultValue: defaultType !== 'emoticon' ? 2 : 3,
            select: this.selectOpt[defaultType],
            value: dafualtValue,
            params,
            behaviorAnalysisHis: [],
        }
    }
    componentWillMount() {
        this.search();
    }
    confirmFn() {
        this.props.confirm();
    }
    pageChange(page) {
        this.setState({
            pages: {
                page,
                size: 50,
            }
        }, () => {
            this.search();
        })
    }
    //识别tab
    tabType(current, data) {
        const { key, value } = data;
        const select = this.selectOpt[key];
        this.setState({
            select,
            value: 0,
            defaultValue: value,
            pages: {
                page: 1,
                size: 50,
            }
        }, () => {
            this.search();
        });
    }
    // select
    tabChange(res) {
        this.setState({
            value: res.value,
            pages: {
                page: 1,
                size: 50,
            }
        }, () => {
            console.log();
            this.search();
        });
    }
    search() {
        const params = {
            ...this.state.params,
            ...this.state.pages,
            event_type: this.state.defaultValue,
            sub_type: this.state.value,
        }
        this.getEmotion(params);
    }
    getEmotion(params) {
        Api.getEmotion(params).then((res) => {
            this.setState({
                behaviorAnalysisHis: res.data,
                count: res.page.count,
            })
        }).catch(err => {
            this.setState({
                behaviorAnalysisHis: [],
                count: 1,
            })
            $_toast(err.desc, 'error')
        })
    }
    render() {
        const { confirm, cancel, data } = this.props;
        const { behaviorAnalysisHis } = this.state;
        const { classInfo } = this.props.data;
        return (
            <div className="classroom-edit">
                <XModal.Header {...this.props}>
                  行为统计-单日-历史记录
                </XModal.Header>
                <XModal.Body>
                    <div className="historyAnalysis">
                        <div className="historyAnalysis-header">
                            <div className="select">
                                <GrounpBtn options={this.state.tabType} onChange={this.tabType.bind(this)} current={this.state.current}></GrounpBtn>
                            </div>
                            <div className="select">
                                <XSelector
                                    options={this.state.select}
                                    defaultValue={this.state.value}
                                    onChange={this.tabChange.bind(this)}/>
                            </div>
                            <XButton type="primary" onClick={this.search.bind(this)}>搜索</XButton>
                        </div>
                        <div className="historyAnalysis-container">
                            <div className="historyAnalysis-left">
                                {/* <div className="avatar">
                                    <span>班级名称</span>
                                </div> */}
                                <h3 className="classesName">{ classInfo.className }</h3>
                                <div className="information">
                                    <span className="tit">班主任</span>
                                    <span className="content">{ classInfo.tearchName }</span>
                                </div>
                                <div className="information marg">
                                    <span className="tit">班级人数</span>
                                    <span className="content">{ classInfo.num }</span>
                                </div>
                                <div className="information">
                                    <span className="tit">查询学期</span>
                                    <span className="content">{ classInfo.term }</span>
                                </div>
                                <div className="information">
                                    <span className="tit">查询周期</span>
                                    <span className="content">{ classInfo.time }</span>
                                </div>
                                <div className="information">
                                    <span className="tit">时段课程</span>
                                    <span className="content">{ classInfo.courseName }</span>
                                </div>
                            </div>
                            <div className="historyAnalysis-right">
                                <div className="cardContainer">
                                    {  behaviorAnalysisHis.length === 0
                                        ? <BNoData></BNoData>
                                        :   behaviorAnalysisHis.map((item) => {
                                           return (
                                            <CardContainer key={item.id} className="hisCard" src={$_conf.preLoadAddr + item.image_url}>
                                                <div className="alt">
                                                    <div className="info">
                                                        <span className="tit">时间</span>
                                                        <span className="infoTit">
                                                            { $_date.init('YYYY-MM-DD HH:mm:ss', item.event_time * 1000).substr(11) }
                                                        </span>
                                                    </div>
                                                    <div className="info">
                                                        <span className="tit">类别</span>
                                                        <span className="infoTit">
                                                            { item.sub_type_desc }
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContainer>
                                           )
                                       })
                                    }
                                </div>
                                <div className="page">
                                    <XPagination
                                        count={this.state.count}
                                        currentPage={this.state.pages.page}
                                        perPage={this.state.pages.size}
                                        isAgeSize={false}
                                        onPageChange={this.pageChange.bind(
                                            this
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </XModal.Body>
            </div>
        )
    }
}
