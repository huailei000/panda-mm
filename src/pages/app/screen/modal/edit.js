import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { XInput, XButton, XModal, XTimePicker, XSelector } from 'xcomponents'
import { $_ajax, $_date, $_toast } from 'services'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state={
          device: [
            {
              label: 'c3v-920',
              value: 1,
            },
            {
              label: 'c3v-321',
              value: 2,
            }
          ],
        modeing: [
            {
                label: '实时',
                value: 3,
            },
            {
                label: '非实时',
                value: 4,
            }
        ],
            box_id: props.data.list.box_id ? props.data.list.box_id : '',
            box: [{label: '', value: null}],
            camera_name: props.data.list.camera_name,
            camera_cruise_time: props.data.type == 'create' ? 15 : props.data.list.camera_cruise_time / 60,
            id: props.data.list.id,
            camera_address: props.data.list.camera_address || '',
            sub_type: props.data.list.sub_type || '',
            classroomArr: props.data.classRoomName,
            classroom_id: props.data.type === 'create' ? '' : props.data.list.classroom.id,
            type: props.data.list.type ? props.data.list.type : '',
            mode: props.data.list.mode ? props.data.list.mode : ''
        }
    }
    productType = [
        {
            label: '考勤巡航',
            value: 1,
        },
        {
            label: '行为全景',
            value: 5,
        }
    ]
    componentDidMount() {
        let optBox = []
        let param = {
            company_id: this.props.data.company_id
        }
        $_ajax.get('info/box', param).then((res) => {
            res.data && res.data.forEach((item)=> {
                optBox.push({ label: item.box_address, value: item.id });
            })  
          this.setState({
            box: optBox,
            box_id: this.state.box_id ? this.state.box_id : optBox[0].value
          })
        })
    }
    confirmFn() {
        const { confirm, data } = this.props
        const { classroom_id, sub_type, camera_address, camera_cruise_time, mode, type } = this.state
        const reg = /^[\da-zA-Z\u4E00-\u9FA5]{1,20}$/i
        const regg = /^[\s]{1,20}$/i
        const regn = /[\d]+/
        if (!reg.test(classroom_id)) {
            $_toast('教室名称填入有误', 'warning')
            return
        } else if (data.deployment == 2 && !reg.test(type)) {
            $_toast('产品类型填入有误', 'warning')
            return
        } else if (!reg.test(sub_type) && this.state.type !== 5) {
            $_toast('摄像头类型填入有误', 'warning')
            return
        } else if (regg.test(camera_address) || !camera_address) {
            $_toast('视频流地址填入有误', 'warning')
            return
        } else if (!regn.test(camera_cruise_time)) {
            $_toast('巡航时间填入有误', 'warning')
            return
        }
        if (type == 5) {
            if (!regn.test(mode)) {
                $_toast('模式填入有误', 'warning')
                return
            }
        }
        let param1 = {
            classroom_id: this.state.classroom_id,
            box_id: this.state.box_id,
            sub_type: this.state.type == 5 ? 1 : this.state.sub_type,
            camera_address: this.state.camera_address,
            camera_cruise_time: parseInt(this.state.camera_cruise_time) * 60,
            type: data.deployment == 1 ? 1 : this.state.type,
            mode: data.deployment == 1 ? 1 : (this.state.type == 1 ? 1 : this.state.mode)
        }
        if (data.type === 'create') {
            $_ajax.post('screen', param1).then(
                res => {
                    confirm()
                    $_toast('新建成功！')
                },
                res => {
                    $_toast(res.desc)
                }
            )
        } else {
            let param2 = {
                classroom_id: this.state.classroom_id,
                box_id: this.state.box_id,
                sub_type: this.state.type == 5 ? 1 : this.state.sub_type,
                camera_address: this.state.camera_address,
                camera_cruise_time: this.state.camera_cruise_time * 60,
                type: data.deployment == 1 ? 1 : this.state.type,
                mode: data.deployment == 1 ? 1 : (this.state.type == 1 ? 1 : this.state.mode)
            }
            $_ajax.put(`screen/${this.state.id}`, param2).then(
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
            <div className="screen-edit">
                <XModal.Header {...this.props}>
                    {' '}
                    {data.type === 'create' ? '新增' : '编辑'}设备
                </XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>教室名称
                            </div>
                            <div className="value">
                                <XSelector
                                    defaultValue={this.state.classroom_id}
                                    options={this.state.classroomArr}
                                    placeholder="请选择教室名称"
                                    onChange={res => {
                                        this.setState({
                                            classroom_id: res.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">主机盒子</div>
                            <div className="value">
                              <XSelector
                                defaultValue={this.state.box_id}
                                options={this.state.box}
                                placeholder="请主机盒子"
                                onChange={(res)=>{
                                  this.setState({box_id: res.value})
                              }}/>
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>产品类型
                            </div>
                            {
                                this.props.data.deployment == 1 ?
                                (
                                    <div className="value-alone">考勤巡航</div>
                                ) :(
                                    <div className="value">
                                        <XSelector
                                            defaultValue={this.state.type}
                                            options={this.productType}
                                            placeholder="请选择产品类型"
                                                    onChange={res => {
                                                this.setState({ type: res.value })
                                            }}
                                            />
                                    </div>
                                )
                            }
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>摄像头类型
                            </div>
                            {
                                this.state.type == 5 ?
                                (
                                    <div className="value-alone">c3v-920</div>
                                ) : (
                                    <div className="value">
                                        <XSelector
                                            defaultValue={this.state.sub_type}
                                            options={this.state.device}
                                            placeholder="请选择摄像头类型"
                                            onChange={res => {
                                                this.setState({ sub_type: res.value })
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>视频流地址
                            </div>
                            <div className="value">
                                <XInput
                                    placeholder="请输入视频流地址"
                                    value={this.state.camera_address}
                                    onChange={res => {
                                        this.setState({ camera_address: res })
                                    }}
                                />
                            </div>
                        </div>
                        
                        {
                            this.state.type == 5 ?
                           (
                                <div className="form-item">
                                    <div className="name">
                                        <span className="required">*</span>模式
                                    </div>
                                    <div className="value">
                                        <XSelector
                                            defaultValue={this.state.mode}
                                            options={this.state.modeing}
                                            placeholder="请选择模式"
                                            onChange={res => {
                                                this.setState({ mode: res.value })
                                            }}
                                        />
                                    </div>
                                </div>
                           ) : (
                                <div className="form-item">
                                    <div className="name">
                                        <span className="required">*</span>巡航时间(分)
                                    </div>
                                    <div className="value">
                                        <XInput placeholder="请输入巡航时间"
                                            value={this.state.camera_cruise_time}
                                            onChange={(res) => {
                                                this.setState({ camera_cruise_time: res })
                                            }} />
                                    </div>
                                </div>
                           )
                        }
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'warning'} onClick={::this.confirmFn}>
                        完成
                    </XButton>
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
