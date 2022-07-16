import { $_toast, $_date } from 'services'
import React, { Component, Fragment } from 'react'
import Api from './services.js'
import newNumber from './modal/newNumber'
import { XTable, XButton, XIcon, XModal } from 'xcomponents'
class CourseNum extends Component {
    constructor() {
        super()
        this.configCourse = [
            '第一节课',
            '第二节课',
            '第三节课',
            '第四节课',
            '第五节课',
            '第六节课',
            '第七节课',
            '第八节课',
            '第九节课',
            '第十节课',
            '第十一节课',
            '第十二节课',
        ]
        this.tableConf = [
            {
                name: '课程节次',
                key: 'num',
                render: ({ num }) =>
                    this.configCourse[num - 1]
                        ? this.configCourse[num - 1]
                        : '-'
            },
            {
                name: '起始时间',
                key: 'start_hour',
                render: res =>
                    `${this.fliterTime(res.start_hour)}:${this.fliterTime(
                        res.start_min
                    )}`
            },
            {
                name: '结束时间',
                key: 'end_hour',
                render: res =>
                    `${this.fliterTime(res.end_hour)}:${this.fliterTime(
                        res.end_min
                    )}`
            },
            {
                name: '学年',
                key: 'term',
                render: res =>
                    `${res.term.term_year}`
            },
            {
                name: '学期',
                key: 'term',
                render: res =>
                    `${res.term.term}`
            },
            {
                name: '操作',
                key: '',
                render: res => {
                    return (
                        <div>
                            <XIcon
                                title="修改"
                                type="edit"
                                onClick={this.editFn.bind(this, 'edit', res)}
                            />
                            <XIcon
                                title="删除"
                                type="minus-circle"
                                onClick={this.deleteFn.bind(this, res.id)}
                            />
                        </div>
                    )
                }
            }
        ]
        this.state = {
            page: {
                currPage: 1,
                pageSize: 40
            },
            terms: []
        }
    }
    componentWillMount() {
        Api.terms()
            .then(res => {
                const terms = res.data.list.map(item => {
                    item.label = item.term
                    item.value = item.id
                    return item
                })
                this.setState({
                    terms
                })
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    /**
     * 补零
     */
    fliterTime(num) {
        const n = Number(num)
        return n < 10 ? `0${n}` : n
    }
    /**
     * 更新tabel
     */
    updataTabe() {
        this.refs.table.getListData()
    }
    /**
     * 新建节次
     */
    newNumber(type, data) {
        XModal.Dialog(newNumber, {
            size: 'md',
            data: {
                type: type,
                terms: this.state.terms,
                ...data
            }
        }).then(
            params => {
                this.updataTabe()
            },
            () => {
                console.log(2)
            }
        )
    }
    /**
     * 编辑
     */
    editFn(data, type) {
        this.newNumber(data, type)
    }
    // /**
    //  * 新建课程
    //  */
    // newClass(params) {
    //   Api.newClass(params).then((res) => {
    //     this.refs.table.getListData()
    //     if (res.code === 0) {
    //       this.refs.table.getListData();
    //       console.log('succuss');
    //     }
    //   });
    // };
    /**
     * 删除
     */
    deleteFn(id) {
        XModal.Confirm({
            msg: (
                <Fragment>
                    <p>确定删除当前课程节次？</p>
                </Fragment>
            )
        }).then(
            () => {
                this.delete(id)
            },
            () => {
                console.log(2)
            }
        )
    }
    /**
     *
     * @param {id} 当前删除ID
     */
    delete(id) {
        Api.deleteClass(id)
            .then(res => {
                if (res.code === 0) {
                    $_toast('删除课程节次成功', 'success')
                    this.updataTabe()
                }
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    onPageChange(page) {
        console.log(page)
    }
    render() {
        return (
            <div className="courseNum">
                <header className="courseHeader">
                    <p>课程节次</p>
                    <XButton
                        type={'primary'}
                        icon="plus-circle"
                        onClick={this.newNumber.bind(this, 'create')}
                    >
                        新建节次
                    </XButton>
                </header>
                <main className="courseTabel">
                    <XTable
                        ref="table"
                        onPageChange={this.onPageChange.bind(this)}
                        tableConf={this.tableConf}
                        url={'info/lessonindexs'}
                    />
                </main>
            </div>
        )
    }
}

// index.propTypes = {
// };

export default CourseNum
