import React, { Component, Fragment } from 'react'
import { XInput, XButton, XModal, XTimePicker } from 'xcomponents'
import { $_ajax, $_date, $_toast, $_errordown } from 'services'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.data.list.id,
            name: props.data.list.name || '',
            location: props.data.list.location || '',
            size: props.data.list.size || '',
            create_time: props.data.list.create_time
                ? $_date.init(
                      'YYYY-MM-DD',
                      new Date(props.data.list.create_time * 1000)
                  )
                : $_date.init('YYYY-MM-DD', new Date())
        }
    }
    confirmFn() {
        const { confirm, data } = this.props
        const { name, size, location } = this.state
        const reg = /^[\da-zA-Z\u4E00-\u9FA5]{1,20}$/i
        const num = /^[1-9]{1,20}$/
        if (!reg.test(name)) {
            $_toast('教室名称填入有误')
            return
        } else if (!reg.test(location)) {
            $_toast('教室位置填入有误', 'warning')
            return
        } else if (isNaN(size)) {
            $_toast('请填入数字', 'warning')
            return
        } else if (size !== '' && size == 0) {
            $_toast('教室容量填入有误', 'warning')
            return
        }
        let param = {
            infoid: this.state.id,
            name: this.state.name,
            location: this.state.location,
            size: this.state.size,
            create_time: new Date(this.state.create_time).getTime()
        }
        if (data.type === 'create') {
            $_ajax.post('info/classroom', param).then(
                res => {
                    confirm()
                    $_toast('新增成功！')
                },
                res => {
                    $_toast(res.desc)
                }
            )
        } else {
            $_ajax
                .put(`info/classroom/${this.state.id}`, {
                    name: this.state.name,
                    location: this.state.location,
                    size: this.state.size,
                    create_time: new Date(this.state.create_time).getTime()
                })
                .then(
                    res => {
                        confirm()
                        $_toast('编辑成功！')
                    },
                    res => {
                        $_toast(res.desc)
                    }
                )
        }
    }

    render() {
        const { confirm, cancel, data } = this.props
        return (
            <div className="classroom-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}教室
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-item">
                            <div className="name"><span className="required">*</span>教室名称</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入教室名称"
                                    maxLength={21}
                                    value={this.state.name}
                                    onChange={res => {
                                        this.setState({ name: res })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">教室容量</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入教室容量"
                                    value={this.state.size}
                                    onChange={res => {
                                        this.setState({ size: res })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name"><span className="required">*</span>教室位置</div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入教室位置"
                                    value={this.state.location}
                                    onChange={res => {
                                        this.setState({ location: res })
                                    }}
                                />
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
