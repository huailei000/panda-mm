import React, { Component, Fragment } from 'react'
import {
    XTable,
    XUploadBtn,
    XButton,
    XSearchInput,
    XIcon,
    XModal
} from 'xcomponents'
import { $_ajax, $_date, $_toast, $_conf } from 'services'
import EditModal from './modal/edit'
import Api from './services'

export default class extends Component {
    state = {
        name: '',
        dataList: [],
        count: '',
        page: 1,
        size: 10,
        code: ''
    }

    tableConf = [
        {
            name: '课程编号',
            key: 'code'
        },
        { name: '课程名称', key: 'name' },
        { name: '专业', key: 'major' },
        { name: '系', key: 'department' },
        {
            name: '创建时间',
            key: 'create_time',
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

    editFn(type, res) {
        let data = {}
        if (type === 'create') {
            data = {
                code: '',
                department: '',
                major: '',
                name: ''
            }
        } else {
            const { code, department, major, name, id } = res
            data = {
                code,
                department: department ? department : '',
                major: major ? major : '',
                name,
                id
            }
        }
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                ...data,
                type
            }
        }).then(() => {
            this.updataTabe()
        })
    }
    /**
     * 更新tabel
     */
    updataTabe() {
        this.refs.table.getListData()
    }
    deleteFn(item) {
        XModal.Confirm({
            size: 'sm',
            title: '确认删除？',
            msg: '确认删除课程？'
        }).then(
            res => {
                this.deleteCo(item.id)
                // $_ajax.delete(`info/classroom/${item.id}`).then((res)=>{
                //     $_toast('删除成功！');
                //     this.props.history.$reload()
                // })
            },
            res => {
                console.log(res)
            }
        )
    }
    deleteCo(id) {
        Api.deleteCourse(id)
            .then(res => {
                $_toast('删除课程成功', 'info')
                this.updataTabe()
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    handleKeyDown(res) {
        // console.log(res,'dssdse')
        this.setState({
            name: res,
            code: res
        })
    }

    clear() {
        this.setState({
            name: '',
            code: ''
        })
    }

    onPageChange() {}
    onBefore() {}

    onStarted() {}

    onFinished() {
        this.updataTabe()
    }

    onError() {}

    onDownLoadTemp() {
        $_ajax.get('import/get/4').then(res => {
            res.data.support_list.length !== 0 &&
                res.data.support_list.map(item => {
                    if (item.action === '课程excel') {
                        window.open($_conf.preLoadAddr + item.example_file)
                    }
                })
        })
    }
    render() {
        return (
            <div className="classroom">
                <div className="classroom-header">
                    <div className="info">课程信息</div>
                    <div className="operate-info">
                        <XSearchInput
                            placeholder={'搜索课程名称'}
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
                            新建课程
                        </XButton>
                        <XUploadBtn
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
                    url={'info/courses'}
                    ref="table"
                    urlParams={
                        this.state.name ? { name: this.state.name } : {}
                    }
                    sequenceMap={{ time: '' }}
                    needTip={true}
                />
            </div>
        )
    }
}
