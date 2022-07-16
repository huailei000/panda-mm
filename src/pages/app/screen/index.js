import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { XTable, XInput, XButton, XSearchInput, XIcon, XModal, XUploadBtn, XSelector } from 'xcomponents';
import { BTimeFilter } from 'bcomponents';
import { $_ajax, $_date, $_toast, $_conf } from 'services';
import EditModal from './modal/edit';

@inject('UserStore')
@observer

export default class extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            dataList: [],
            count: '',
            page: 1,
            size: 10,
            classRoomName: [],
            Model: [],
            clsAbc: ''

        }
    }
    device = [
        {
            label: '请选择',
            value: ''
        },
        {
            label: 'c3v-920',
            value: 1
        },
        {
            label: 'c3v-321',
            value: 2
        }
    ]
    //table配置项
    tableConf = [
        { name: '教室名称', key: "classroom.name",
            render: (res) => {
                return <p>{res.classroom.name}</p>
            }
        },
        { name: '设备型号', key: "sub_type",
          render: (res) => {
                if (res.sub_type === 1) {
                    return 'c3v-920';
                } else if (res.sub_type === 2) {
                    return 'c3v-321';
                }
            }
        },
        { name: '视频流地址', key: "camera_address" },
        { name: '操作', key: "operation",
          render: (res) => 
            <Fragment>
                <XIcon title="修改" type="edit" onClick={this.editFn.bind(this, 'edit', res)}></XIcon>
                <XIcon title="删除" type="minus-circle" onClick={this.deleteFn.bind(this, res)}></XIcon>
            </Fragment>
        },
        { name: '识别主机', key: 'ip_token' }
    ]

    editFn(type, item) {
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                type: type,
                list: item,
                company_id: this.props.UserStore.user.company_id,
                deployment: this.props.UserStore.user.company.deployment,
                classRoomName: this.state.classRoomName
            }
        }).then((res) => {
            this.props.history.$reload()
        })
    }
    componentDidMount() {
        let optArr = [
            {
                label: '请选择',
                value: '',
            },];
        $_ajax.get('info/classrooms',{
            size: 100000
        }).then((res) => {
            res.data.list.forEach(element => {
            optArr.push({label: element.name, value: element.id});
            });
            this.setState({
                classRoomName: optArr
            })
        })
    }
    //删除
    deleteFn(item) {
        XModal.Confirm({ size: 'sm', title: '确认删除？', msg: <Fragment><p>确认删除设备？</p></Fragment> })
            .then((res) => {
                $_ajax.delete(`screen/${item.id}`).then((res) => {
                    $_toast('删除成功！');
                    this.refs.table.getListData();
                }, res => {
                    $_toast(res.desc);
                })
            }
        )
    }

    handleKeyDown(res) {
        this.setState({
            name: res
        })
    }

    clear() {
        this.setState({
            name: ''
        })
    }

    onFinished() {
        this.props.history.$reload()
    }

    search() {      
            
    }

    render() {
        return (
            <div className="screen">
                <div className="screen-header">
                    <div className="info">设备信息</div>
                    <div className="operate-info">
                        <XSelector
                            options={this.state.classRoomName}
                            className="operate-info-first"
                            placeholder="请选择教室"
                            onChange={res => {
                                this.setState({
                                    clsAbc: res.value,

                                })
                            }}
                        />
                        <XSelector
                            options={this.device}
                            placeholder="请选择设备型号"
                            onChange={res => {
                                this.setState({
                                    Model:res.value
                                })
                            }}
                        />
                        {/* <XButton type={'primary'} onClick={this.search.bind(this)} >搜索</XButton> */}
                        <XButton
                            type={'primary'}
                            icon="plus-circle"
                            className="item"
                            onClick={this.editFn.bind(this, 'create')}
                        >
                            新建设备
                        </XButton>
                    </div>
                </div>
                <div />
                <XTable
                    ref="table"
                    tableConf={this.tableConf}
                    url={'screens'}
                    urlParams={
                        {
                            sub_type: this.state.Model,
                            classroom_id: this.state.clsAbc,
                        }        
                    }
                    sequenceMap={{
                        size: this.state.size,
                        page: this.state.page,
                        sub_type: this.state.Model,
                        classroom_id: this.state.clsAbc,
                    }}
                />
            </div>
        )
    }
}
