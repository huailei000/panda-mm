import React, { Component, Fragment } from 'react'
import { XInput, XSelector, XButton, XModal, XImages } from 'xcomponents'
import { $_ajax, $_date, $_conf } from 'services'

export default class extends Component {
    constructor(props) {
        super(props)
        ;(this.state = {
            id: props.data.list.id,
            name: props.data.list.name,
            gender: props.data.list.gender,
            certificate_type: props.data.list.certificate_type,
            certificate_number: props.data.list.certificate_number,
            start_time: props.data.list.start_time
                ? $_date.init(
                      'YYYY-MM-DD',
                      new Date(props.data.list.start_time * 1000)
                  )
                : $_date.init('YYYY-MM-DD', new Date()),
            job_number: props.data.list.job_number,
            create_time: props.data.list.create_time
                ? $_date.init(
                      'YYYY-MM-DD',
                      new Date(props.data.list.create_time * 1000)
                  )
                : $_date.init('YYYY-MM-DD', new Date())
        }),
        (this.gender = {
            1: '男',
            2: '女'
        }),
            (this.certificate_type = {
                1: '身份证',
                2: '护照'
            })
    }

    confirmFn() {
        const { confirm, data } = this.props
        let param = {
            name: this.state.name,
            gender: this.state.gender,
            certificate_type: this.state.certificate_type,
            certificate_number: this.state.certificate_number,
            start_time: this.state.start_time,
            job_number: this.state.job_number
        }
        if (data.type === 'create') {
            $_ajax.post('student', param).then(res => {
                confirm()
            })
        } else {
            $_ajax.put(`student/${this.state.sid}`, param).then(res => {
                confirm()
            })
        }
    }

    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="student-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '查看详情'}
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-images">
                            <div className="name">底库照片</div>
                            <div className="value">
                                <XImages>
                                    {this.props.data.list.photos &&
                                    this.props.data.list.photos.length > 0 ? (
                                        this.props.data.list.photos.map(
                                            (item, index) => {
                                                return (
                                                    <XImages.Image
                                                        key={index}
                                                        // imgUrl={$_conf.preLoadAddr + item.url}
                                                        imgUrl={item.url}
                                                    />
                                                )
                                            }
                                        )
                                    ) : (
                                        <XImages.Void />
                                    )}
                                </XImages>
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">教师姓名</div>
                            <div className="value">{this.state.name}</div>
                        </div>
                        <div className="form-item">
                            <div className="name">工号</div>
                            <div className="value">{this.state.job_number}</div>
                        </div>
                        <div className="form-item">
                            <div className="name">证件类型</div>
                            <div className="value">
                                {this.state.certificate_type !== 0
                                    ? this.certificate_type[
                                          this.state.certificate_type
                                      ]
                                    : null}
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">性别</div>
                            <div className="value">
                                {this.state.gender !== 0
                                    ? this.gender[this.state.gender]
                                    : null}
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">证件号码</div>
                            <div className="value">
                                {this.state.certificate_number}
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">创建时间</div>
                            <div className="value">
                                {this.state.create_time}
                            </div>
                        </div>
                    </div>
                </XModal.Body>
            </div>
        )
    }
}
