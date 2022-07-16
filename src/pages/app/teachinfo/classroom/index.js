import React, { Component, Fragment } from 'react'
import {
    XTable,
    XInput,
    XButton,
    XSearchInput,
    XIcon,
    XModal,
    XUploadBtn
} from 'xcomponents'
import { $_ajax, $_date, $_toast, $_conf } from 'services'
import EditModal from './modal/edit'

export default class extends Component {
    state = {
        name: '',
        dataList: [],
        date: [
            $_date.getThisFullWeek(new Date())[0],
            $_date.getThisFullWeek(new Date())[6]
        ],
        count: '',
        page: 1,
        size: 10
    }

    //table配置项
    tableConf = [
        { name: '教室名称', key: 'name' },
        { name: '教室位置', key: 'location' },
        { 
            name: '教室容量/人',
            key: 'size',
            render: res => {
                if (res.size === 0) {
                    return '-'
                }else {
                    return res.size
                }
            }
        },
        {
            name: '创建时间',
            key: 'create_time',
            align: 'center',
            render: res => $_date.init('YYYY-MM-DD', res.create_time * 1000)
        },
        {
            name: '操作',
            key: '',
            render: res => (
                <Fragment>
                    <XIcon
                        title="修改"
                        type="edit"
                        onClick={this.editFn.bind(this, 'edit', res)}
                    />
                    <XIcon
                        title="删除"
                        type="minus-circle"
                        onClick={this.deleteFn.bind(this, res)}
                    />
                </Fragment>
            )
        }
    ]

    editFn(type, item) {
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                type: type,
                list: item
            }
        }).then(() => {
            this.refs.table.getListData()
        })
    }

    //删除
    deleteFn(item) {
        XModal.Confirm({
            size: 'sm',
            title: '确认删除？',
            msg: (
                <Fragment>
                    <p>确认删除教室？</p>
                </Fragment>
            )
        }).then(
            res => {
                $_ajax.delete(`info/classroom/${item.id}`).then(res => {
                    $_toast('删除成功！')
                    this.refs.table.getListData()
                }, res => {
                    $_toast(res.desc)
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

    onDownLoadTemp() {
        $_ajax.get('import/get/3').then(
            res => {
                window.open(
                    $_conf.preLoadAddr + res.data.support_list[0].example_file
                )
            },
            res => {
                $_toast('获取模版失败！')
            }
        )
    }

    render() {
        return (
            <div className="classroom">
                <div className="classroom-header">
                    <div className="info">教室信息</div>
                    <div className="operate-info">
                        <XSearchInput
                            placeholder={'搜索教室名称'}
                            value={this.state.name}
                            size="md"
                            onSearch={this.handleKeyDown.bind(this)}
                            onClear={this.clear.bind(this)}
                        />
                        <XButton
                            type={'primary'}
                            icon="plus-circle"
                            className="item"
                            onClick={this.editFn.bind(this, 'create')}
                        >
                            新建教室
                        </XButton>
                        <XUploadBtn
                            onFinished={this.onFinished.bind(this)}
                            onDownLoadTemp={this.onDownLoadTemp.bind(this)}
                        />
                    </div>
                </div>
                <div />
                <XTable
                    ref="table"
                    tableConf={this.tableConf}
                    url={'info/classrooms'}
                    urlParams={this.state.name ? { name: this.state.name } : {}}
                    sequenceMap={{
                        size: this.state.size,
                        page: this.state.page
                    }}
                    needTip={true}
                />
            </div>
        )
    }
}
