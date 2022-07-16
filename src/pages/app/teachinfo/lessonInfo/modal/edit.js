import React, { Component, Fragment } from 'react'
import { XInput, XButton, XModal } from 'xcomponents'
import { $_toast, $_date } from 'services'
import Api from '../services'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...props.data
        }
    }
    confirmFn() {
        const { type, code, name, major, department, id } = this.state;
        const reg = /^[\s\da-zA-Z\u4E00-\u9FA5]{1,20}$/iu;
        const regCh = /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/iu;
        if (!reg.test(code)) {
            $_toast('课程编号填写有误', 'warning');
            return
        } else if (!regCh.test(name)) {
            $_toast('课程名称填写有误', 'warning');
            return
        } else if (major !== '' && !reg.test(major)) {
            $_toast('专业名称填写有误', 'warning');
            return
        } else if (department !== '' && !reg.test(department)) {
            $_toast('系名称填写有误', 'warning');
            return
        }
        const params = {
            code,
            name
        }
        if (major !== '') {
            params.major = major;
        }
        if (department !== '') {
            params.department = department;
        }
        if (type === 'create') {
            this.createCourse(params);
        } else {
            this.putCourse(params, id);
        }
    }
    createCourse(params) {
        Api.newCourse(params)
            .then(res => {
                $_toast('新建课程成功', 'info')
                this.props.confirm()
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    putCourse(params, id) {
        Api.putCourse(params, id)
            .then(res => {
                if (res.code === 0) {
                    $_toast('编辑课程成功', 'info')
                    this.props.confirm()
                }
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="classroom-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}课程
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>课程编号
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入课程编号"
                                    value={this.state.code}
                                    onChange={res => {
                                        this.setState({ code: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>课程名称
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入课程名称"
                                    value={this.state.name}
                                    onChange={res => {
                                        this.setState({ name: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">专业</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入专业"
                                    value={this.state.major}
                                    onChange={res => {
                                        this.setState({ major: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">系</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入系"
                                    value={this.state.department}
                                    onChange={res => {
                                        this.setState({ department: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        {/* <div className="form-item">
                            <div className="name">创建时间</div>
                            <div className="value">
                                {this.state.create_time}
                            </div>
                        </div> */}
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
