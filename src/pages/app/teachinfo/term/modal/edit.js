import React, { Component, Fragment } from 'react'
import {
    XTable,
    XInput,
    XButton,
    XSearchInput,
    XIcon,
    XModal,
    XDatePickerInput
} from 'xcomponents'
import { $_ajax, $_date, $_toast } from 'services'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.data.list.id,
            term: props.data.list.term || '',
            term_year: props.data.list.term_year || '',
            start_time: props.data.list.start_time
                ? new Date(props.data.list.start_time * 1000)
                : new Date(),
            end_time: props.data.list.end_time
                ? new Date(props.data.list.end_time * 1000)
                : new Date(),
            create_time: props.data.list.create_time
                ? new Date(props.data.list.create_time * 1000)
                : new Date()
        }
    }
    objecting() {}

    confirmFn() {
        const { confirm, data } = this.props
        const { term, term_year, start_time, end_time } = this.state
        const reg = /^[\da-zA-Z\u4E00-\u9FA5\-]{1,20}$/i
        if (!reg.test(term_year)) {
            $_toast('学年填入有误', 'warning')
            return
        } else if (!reg.test(term)) {
            $_toast('学期填入有误', 'warning')
            return
        } 
        let param = {
            term,
            term_year,
            start_time: $_date.init('YYYY-MM-DD', this.state.start_time),
            end_time: $_date.init('YYYY-MM-DD', this.state.end_time)
        }
        if (data.type === 'create') {
            $_ajax.post('info/term', param).then(
                res => {
                    confirm()
                    $_toast('新增成功！')
                },
                res => {
                    $_toast(res.desc)
                }
            )
        } else {
            $_ajax.put(`info/term/${this.state.id}`, {
                    term: this.state.term,
                    term_year: this.state.term_year,
                    start_time: $_date.init('YYYY-MM-DD', this.state.start_time),
                    end_time: $_date.init('YYYY-MM-DD', this.state.end_time)
                })
                .then(res => {
                    confirm()
                    $_toast('编辑成功！')
                })
                .catch(err => {
                    $_toast(err.desc, 'error')
                })
        }
    }

    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="term-dialog">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}学期学年
                </XModal.Header>
                <XModal.Body>
                    <div className="dialog-body">
                        <span className="dialog-body-title">
                            <span className="required">*</span>学年
                        </span>
                        <div className="dialog-body-con">
                            <XInput
                                placeholder="请输入学年"
                                value={this.state.term_year}
                                onChange={res => {
                                    this.setState({ term_year: res })
                                }}
                            />
                        </div>
                    </div>
                    <div className="dialog-body">
                        <span className="dialog-body-title">
                            <span className="required">*</span>学期
                        </span>
                        <div className="dialog-body-con">
                            <XInput
                                placeholder="请输入学期"
                                value={this.state.term}
                                onChange={res => {
                                    this.setState({ term: res })
                                }}
                            />
                        </div>
                    </div>
                    <div className="dialog-body">
                        <span className="dialog-body-title">
                            <span className="required">*</span>起始时间
                        </span>
                        <div className="dialog-body-con">
                            <XDatePickerInput
                                icon="plus"
                                value={this.state.start_time}
                                dateFormat={'YYYY-MM-DD'}
                                placeholder="请选择时间"
                                onChange={res => {
                                    this.setState({ start_time: res })
                                }}
                            />
                        </div>
                    </div>
                    <div className="dialog-body">
                        <span className="dialog-body-title">
                            <span className="required">*</span>结束时间
                        </span>
                        <div className="dialog-body-con">
                            <XDatePickerInput
                                value={this.state.end_time}
                                dateFormat={'YYYY-MM-DD'}
                                placeholder="结束时间"
                                onChange={res => {
                                    this.setState({ end_time: res })
                                }}
                            />
                        </div>
                    </div>
                    <div className="dialog-body">
                        <span className="dialog-body-title">创建时间</span>
                        <p className="dialog-body-time">
                            {$_date.init('YYYY-MM-DD', this.state.create_time)}
                        </p>
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'warning'} onClick={::this.confirmFn}>完成</XButton>
                    <XButton
                        type={'primary'}
                        onClick={() => {
                            cancel()
                        }}
                    >
                        取消
                    </XButton>
                </XModal.Footer>
            </div>
        )
    }
}
