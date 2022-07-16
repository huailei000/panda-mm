import React, { Component, Fragment } from 'react'
import { XInput, XButton, XModal, XIcon } from 'xcomponents'
import { $_toast, $_date } from 'services'
import Api from '../services'

export default class extends Component {
    constructor(props) {
        super(props)
        const tearch = props.data.teacher.find(item => item.id === props.data.teacher_id);
        props.data.teacher_id = tearch ? tearch.label : ''
        props.data.begin_time = props.data.begin_time !== 0 ? props.data.begin_time : '';
        console.log(props.data.begin_time);
        this.state = {
            list: [
                {
                    name: '班级名称',
                    key: 'name'
                },
                {
                    name: '年级',
                    key: 'name'
                },
                {
                    name: '班级代码',
                    key: 'code'
                },
                {
                    name: '院系',
                    key: 'department'
                },
                {
                    name: '班级人数',
                    key: 'num'
                },
                {
                    name: '专业',
                    key: 'major'
                },
                {
                    name: '开班日期',
                    key: 'begin_time',
                    type: 'time'
                },
                {
                    name: '班主任',
                    key: 'teacher_id'
                },
                {
                    name: '创建时间',
                    key: 'create_time',
                    type: 'time'
                },
                {
                    name: '学制',
                    key: 'program'
                }
            ]
        }
    }
    confirmFn() {}
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
                        {this.state.list.map((item, index) => {
                            return (
                                <div className="form-item" key={index}>
                                    <div className="name">{item.name}</div>
                                    <div className="value">
                                        {item.key == 'begin_time' && data[item.key] || item.key == 'create_time' ? $_date.init(
                                                  'YYYY-MM-DD',
                                                  data[item.key] * 1000
                                              )
                                            : data[item.key]}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </XModal.Body>
                {/* <XModal.Footer>
                    <XButton type={'primary'} onClick={::this.confirmFn}>确认</XButton>
                    <XButton onClick={() => {
                        cancel();
                    }}>
                    关闭
                    </XButton>
                </XModal.Footer> */}
            </div>
        )
    }
}
