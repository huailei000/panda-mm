import React, { Component, Fragment } from 'react'
import {
    XTable,
    XInput,
    XButton,
    XSearchInput,
    XIcon,
    XModal,
    XImages,
    XUploadBtn
} from 'xcomponents'
import { $_ajax, $_date, $_toast, $_conf } from 'services'
import EditModal from './modal/edit'
import SeeModal from './modal/see'

export default class extends Component {
    state = {
        name: '',
        dataList: [],
        count: '',
        page: 1,
        size: 10
    }

    tableConf = [
        {
            name: '底库图片',
            key: 'photos',
            width: '300px',
            render: res => (
                <Fragment>
                    {res.photos && res.photos.length > 0 ? (
                        res.photos.map((item, index) => {
                            return (
                                <XImages.Image
                                    key={index}
                                    // imgUrl={$_conf.preLoadAddr + item.url}
                                    imgUrl={item.url}
                                />
                            )
                        })
                    ) : (
                        <XImages.Void />
                    )}
                </Fragment>
            )
        },
        { name: '教师姓名', key: 'name' },
        { name: '工号', key: 'job_number' },
        {
            name: '性别',
            key: 'gender',
            render: res => {
                if (res.gender === 1) {
                    return '男'
                } else if (res.gender === 2) {
                    return '女'
                }
            }
        },
        { name: '证件号', key: 'certificate_number' },
        {
            name: '操作',
            key: 'operation',
            render: res => (
                <Fragment>
                    <XIcon
                        title="查看"
                        type="eye"
                        onClick={this.seeFn.bind(this, 'see', res)}
                    />
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

    seeFn(type, item) {
        XModal.Dialog(SeeModal, {
            size: 'lg',
            data: {
                type: type,
                list: item
            }
        }).then(() => {
            this.props.history.$reload()
        })
    }

    editFn(type, item) {
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                type: type,
                list: item
            }
        }).then(() => {
            this.props.history.$reload()
        })
    }

    deleteFn(item) {
        XModal.Confirm({
            size: 'sm',
            title: '确认删除？',
            msg: '确认删除这条教师信息？'
        }).then(
            res => {
                $_ajax.delete(`subject/delete`, {
                        subject_id: item.id + '',
                        subject_type: 1
                    })
                    .then(res => {
                        $_toast('删除成功！')
                        this.props.history.$reload()
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

    onPageChange() {}

    onBefore() {}

    onStarted() {}

    onFinished() {
        this.props.history.$reload()
    }

    onError() {}

    onDownLoadTemp() {
        $_ajax.get('import/get/2').then(
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
            <div className="teacher">
                <div className="teacher-header">
                    <div className="info">教师信息</div>
                    <div className="operate-info">
                        <XSearchInput
                            placeholder={'搜索 教师姓名'}
                            value={this.state.name}
                            size="md"
                            onSearch={this.handleKeyDown.bind(this)}
                            onClear={this.clear.bind(this)}
                        />
                        <XButton
                            type={'primary'}
                            className="item"
                            icon="plus-circle"
                            onClick={this.editFn.bind(this, 'create')}
                        >
                            新建教师
                        </XButton>
                        <XUploadBtn
                            ajaxUrl="/api/v1/import/zip"
                            acceptType=".zip, aplication/zip "
                            fileType="zip"
                            params={{ subject_type: 1 }}
                            onBefore={this.onBefore.bind(this)}
                            onStarted={this.onStarted.bind(this)}
                            onFinished={this.onFinished.bind(this)}
                            onError={this.onError.bind(this)}
                            onDownLoadTemp={this.onDownLoadTemp.bind(this)}
                        />
                    </div>
                </div>
                <XTable
                    tableConf={this.tableConf}
                    onPageChange={this.onPageChange.bind(this)}
                    url={'teachers'}
                    urlParams={this.state.name ? { name: this.state.name } : {}}
                    sequenceMap={{ time: '' }}
                    needTip={true}
                />
            </div>
        )
    }
}
