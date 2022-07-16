import React, { Component, Fragment } from 'react'
import {
    XTable,
    XInput,
    XButton,
    XSearchInput,
    XIcon,
    XModal
} from 'xcomponents'
import { $_ajax, $_date, $_toast } from 'services'
import EditModal from './modal/edit'

export default class extends Component {
    state = {
        name: '',
        dataList: [],
        count: '',
        page: 1,
        size: 10
    }

    tableConf = [
        { name: '学年', key: 'term_year' },
        { name: '学期', key: 'term' },
        {
            name: '起始时间',
            key: 'start_time',
            align: 'center',
            render: res => $_date.init('YYYY-MM-DD', res.start_time * 1000)
        },
        {
            name: '结束时间',
            key: 'end_time',
            render: res => $_date.init('YYYY-MM-DD', res.end_time * 1000)
        },
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

    // 编辑 新建
    editFn(type, item) {
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                type: type,
                list: item
            }
        }).then(
            () => {
                this.props.history.$reload()
            },
            () => {}
        )
    }
    // 删除功能
    deleteFn(item) {
        XModal.Confirm({
            size: 'sm',
            title: '确认删除？',
            msg: (
                <Fragment>
                    <p>确认删除学期学年吗？</p>
                </Fragment>
            )
        }).then(
            res => {
                $_ajax.delete(`info/term/${item.id}`).then(res => {
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

    render() {
        return (
            <div className="term">
                <div className="term-header">
                    <div className="info">学期学年信息</div>
                    <div className="operate-info">
                        <XButton
                            type={'primary'}
                            className="item"
                            icon="plus-circle"
                            onClick={this.editFn.bind(this, 'create')}
                        >
                            新建学期
                        </XButton>
                    </div>
                </div>
                <XTable
                    tableConf={this.tableConf}
                    onPageChange={this.onPageChange.bind(this)}
                    url={'info/terms'}
                    urlParams={this.state.name ? { name: this.state.name } : {}}
                    sequenceMap={{ time: '' }}
                />
            </div>
        )
    }
}
