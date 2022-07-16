import React, { Component } from 'react'
import { $_toast } from 'services'
import Api from '../services.js'
import { XTimePicker, XButton, XSelector, XModal } from 'xcomponents'
import PropTypes from 'prop-types'

class newNumber extends Component {
    static defaultProps = {
        num: 1
    }
    constructor(props) {
        super(props)
        const num = props.data.type === 'edit' ? props.data.num : props.num
        const startTime =
            props.data.type === 'edit'
                ? `${props.data.start_hour}:${props.data.start_min}`
                : ''
        const endTime =
            props.data.type === 'edit'
                ? `${props.data.end_hour}:${props.data.end_min}`
                : ''
        const term_id = props.data.type === 'edit' ? props.data.term.id : ''
        const company_id =
            props.data.type === 'edit' ? props.data.term.company_id : ''
        let term_yearId =
            props.data.type === 'edit' ? props.data.term.term_year : ''
        const allterms = {}
        const term_year = []

        props.data.terms.forEach((item, index) => {
            if (!allterms[item.term_year]) {
                allterms[item.term_year] = []
                term_year.push({
                    label: item.term_year,
                    value: item.term_year
                })
            }
            if (index === 0 && !term_yearId) {
                term_yearId = item.term_year
            }
            allterms[item.term_year].push(item)
        })
        const terms = allterms[term_yearId]
        this.state = {
            allterms,
            term_yearId,
            term_year,
            terms,
            term_id,
            company_id,
            num,
            endTime,
            startTime,
            option: [
                {
                    label: '第一节课',
                    value: 1
                },
                {
                    label: '第二节课',
                    value: 2
                },
                {
                    label: '第三节课',
                    value: 3
                },
                {
                    label: '第四节课',
                    value: 4
                },
                {
                    label: '第五节课',
                    value: 5
                },
                {
                    label: '第六节课',
                    value: 6
                },
                {
                    label: '第七节课',
                    value: 7
                },
                {
                    label: '第八节课',
                    value: 8
                },
                {
                    label: '第九节课',
                    value: 9
                },
                {
                    label: '第十节课',
                    value: 10
                },
                {
                    label: '第十一节课',
                    value: 11
                },
                {
                    label: '第十二节课',
                    value: 12
                }
            ]
        }
    }
    /**
     * 新建课程
     */
    newClass(params) {
        Api.newClass(params)
            .then(res => {
                this.props.confirm(this.state.selectedArea)
                $_toast('新建节点成功', 'info')
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    /**
     * 编辑课程
     */
    putClass(params, id) {
        Api.putClass(params, id)
            .then(res => {
                this.props.confirm(this.state.selectedArea)
                $_toast('编辑课程节次成功', 'info')
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    confirm() {
        let { startTime, endTime, num, company_id, term_id } = this.state
        if (term_id === '') {
            $_toast('请选择学年学期', 'info')
            return
        } else if (num === '') {
            $_toast('请选择节次节点', 'info')
            return
        } else if (startTime === '' || endTime === '') {
            $_toast('请选择节次时间', 'info')
            return
        }
        startTime = this.state.startTime.split(':')
        endTime = this.state.endTime.split(':')
        const params = {
            end_hour: endTime[0] * 1,
            end_min: endTime[1] * 1,
            num,
            start_hour: startTime[0] * 1,
            start_min: startTime[1] * 1,
            term_id
        }
        if (this.props.data.type === 'edit') {
            this.putClass(params, this.props.data.id)
        } else {
            this.newClass(params)
        }
    }
    close() {
        this.props.cancel()
    }
    render() {
        return (
            <div className="newNumberDilog-demo">
                <XModal.Header {...this.props}>{ this.props.data.type === 'edit' ? '编辑节次' : '新建节次' }</XModal.Header>
                <XModal.Body>
                    {/* <XSelector></XSelector> */}
                    <div className="selector">
                        <div className="nodeSelector">
                            <span>
                                学年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            <div>
                                <XSelector
                                    options={this.state.term_year}
                                    defaultValue={this.state.term_yearId}
                                    onChange={res => {
                                        this.setState({
                                            term_yearId: res.value,
                                            term_id: '',
                                            terms: this.state.allterms[
                                                res.value
                                            ]
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="nodeSelector">
                            <span>
                                学期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {/* { this.state.term_id }s */}
                            </span>
                            <div>
                                <XSelector
                                    options={this.state.terms}
                                    defaultValue={this.state.term_id}
                                    onChange={res => {
                                        this.setState({
                                            term_id: res.value,
                                            company_id: res.company_id
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="nodeSelector">
                            <span>节次节点</span>
                            <div>
                                <XSelector
                                    options={this.state.option}
                                    defaultValue={this.state.num}
                                    onChange={res => {
                                        this.setState({
                                            num: res.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        {/* terms */}
                        <div className="nodeSelector">
                            <span>节次时间</span>
                            <div className="timeId">
                                <XTimePicker
                                    hour={
                                        this.state.startTime.split(':')[0] !==
                                        'undefined'
                                            ? this.state.startTime.split(':')[0]
                                            : ''
                                    }
                                    min={
                                        this.state.startTime.split(':')[1] !==
                                        'undefined'
                                            ? this.state.startTime.split(':')[1]
                                            : ''
                                    }
                                    onChange={res => {
                                        this.setState({ startTime: res })
                                    }}
                                />
                                <span>至</span>
                                <XTimePicker
                                    hour={
                                        this.state.endTime.split(':')[0] !==
                                        'undefined'
                                            ? this.state.endTime.split(':')[0]
                                            : ''
                                    }
                                    min={
                                        this.state.endTime.split(':')[1] !==
                                        'undefined'
                                            ? this.state.endTime.split(':')[1]
                                            : ''
                                    }
                                    onChange={res => {
                                        this.setState({ endTime: res })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'warning'} onClick={this.confirm.bind(this)}>
                        完成
                    </XButton>
                    <XButton type={'primary'} onClick={this.close.bind(this)}>
                        取消
                    </XButton>
                </XModal.Footer>
            </div>
        )
    }
}

newNumber.propTypes = {}

export default newNumber
