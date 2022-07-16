import React, { Component, Fragment } from 'react'
import { XInput, XButton, XModal, XDatePickerInput, XSelector } from 'xcomponents'
import { $_toast, $_date } from 'services'
import Api from '../services'
import EditMember from './editMember'

export default class extends Component {
    constructor(props) {
        super(props)
        let data = {
            create_time: $_date.init('YYYY-MM-DD', new Date()),
            begin_time: '',
            name: '',
            code: '',
            department: '',
            grade: '',
            major: '',
            program: '',
            student_id: '',
            students: [],
            teacher_id: '',
        }
        if (props.data.type === 'edit') {
            data = props.data
            data.create_time *= 1000
            data.begin_time = props.data.begin_time !== 0 ? new Date(props.data.begin_time * 1000) : '';
            data.teacher_id = !props.data.teacher_id ? '' : props.data.teacher_id;
        }
        const pages = {
            page: 1,
            size: 500
        }
        this.state = {
            students: [],
            ...data,
            ...pages
        }
    }
    componentWillReceiveProps(newProps) {
        // console.log(newProps)
    }
    confirmFn() {
        const {
            begin_time, // 开始时间
            code, // 班级代码
            department, // 系
            grade, // 年级
            major, // 专业
            name, // 班级名称
            program, // 学制
            students, // 学生ID
            teacher_id // 教师姓名
        } = this.state
        const student_id = students.map(item => item.id).join(',')
        const reg = /^[\s\da-zA-Z\u4E00-\u9FA5]{1,20}$/iu
        const regInfo = {
            flag: false,
            info: {}
        }
        const regData = [
            {
                reg,
                require: true,
                value: name,
                msg: '班级名字填写有误'
            },
            {
                reg,
                require: true,
                value: grade,
                msg: '年级名称填写有误'
            },
            {
                reg,
                require: false,
                value: code,
                msg: '班级代码填写有误'
            },
            {
                reg,
                require: false,
                value: department,
                msg: '院系名称填写有误'
            },
            {
                reg,
                require: false,
                value: major,
                msg: '专业名称填写有误'
            },
            {
                reg,
                require: false,
                value: teacher_id,
                msg: '班主任名称填写有误'
            },
            {
                reg,
                require: false,
                value: program,
                msg: '学制名称填写有误'
            }
        ]
        regData.forEach(regs => {
            if (regInfo.flag) return
            const { require, reg, msg, value } = regs
            if (require && !reg.test(value)) {
                regInfo.flag = true
                regInfo.info = regs
                return
            } else if (!require && value !== '' && !reg.test(value)) {
                regInfo.flag = true
                regInfo.info = regs
                return
            }
        })
        if (regInfo.flag) {
            $_toast(regInfo.info.msg, 'info')
            return
        }
        const params = {
            begin_time: begin_time ? $_date.init('YYYY-MM-DD', new Date(begin_time)) : '', // 开始时间
            code, // 班级代码
            department, // 系
            grade, // 年级
            major, // 专业
            name, // 班级名称
            program, // 学制
            student_id, // 学生ID
            teacher_id: teacher_id // 教师id
        }
        if (this.props.data.type === 'edit') {
            this.editClass(this.state.id, params)
        } else {
            this.newClass(params)
        }
    }
    newClass(params) {
        Api.newClass(params)
            .then(res => {
                $_toast('新建班级成功', 'info')
                this.props.confirm()
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    editClass(id, params) {
        Api.editClass(id, params)
            .then(res => {
                $_toast('编辑班级成功', 'info')
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
    emitClass() {
        // this.props.data.showEmitMember();
        this.getStudent()
    }
    getStudent() {
        // if (this.state.students) return;
        Api.students({
            page: 1,
            size: 500
        })
            .then(res => {
                this.setState({
                    studentsDate: res.data.list
                })
                this.emitMenmber(res.data.list, res.page)
            })
            .catch(err => {
                $_toast(err.desc)
            })
    }
    emitMenmber() {
        XModal.Dialog(EditMember, {
            size: 'sg',
            data: {
                student: this.state.students
            }
        }).then(res => {
            // this.updataTabe();
            // console.log(res, 13213123);
            this.setState({
                students: res
            })
        })
    }
    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="classroom-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}班级
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>班级名称
                            </div>
                            <div className="value">
                                {/* { this.props } */}
                                <XInput
                                    placeholder="请输入班级名称"
                                    value={this.state.name || ''}
                                    onChange={res => {
                                        this.setState({ name: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>年级
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入年级名称"
                                    value={this.state.grade || ''}
                                    onChange={res => {
                                        this.setState({ grade: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">班级代码</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入班级代码"
                                    value={this.state.code || ''}
                                    onChange={res => {
                                        this.setState({ code: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">院系</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入院系"
                                    value={this.state.department || ''}
                                    onChange={res => {
                                        this.setState({ department: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">班级人数</div>
                            <div className="value classPel">
                                <span>{this.state.students.length}</span>
                                <XButton
                                    type={'primary'}
                                    icon="users"
                                    onClick={this.emitMenmber.bind(this)}
                                >
                                    班级成员
                                </XButton>
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">专业</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入专业名称"
                                    value={this.state.major || ''}
                                    onChange={res => {
                                        this.setState({ major: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">开班日期</div>
                            <div className="value">
                                <XDatePickerInput
                                    value={this.state.begin_time}
                                    dateFormat={'YYYY-MM-DD'}
                                    placeholder="请选择时间"
                                    onChange={res => {
                                        this.setState({
                                            begin_time: $_date.init(
                                                'YYYY-MM-DD',
                                                res
                                            )
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">班主任</div>
                            <div className="value">
                                <XSelector
                                    options={this.props.data.teacher}
                                    defaultValue={this.state.teacher_id}
                                    onChange={res => {
                                        this.setState({
                                            teacher_id: res.id,
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">创建时间</div>
                            <div className="value">
                                {$_date.init(
                                    'YYYY-MM-DD',
                                    this.state.create_time
                                )}
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">学制</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入学制名称"
                                    value={this.state.program || ''}
                                    onChange={res => {
                                        this.setState({ program: res.trim() })
                                    }}
                                />
                            </div>
                        </div>
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
