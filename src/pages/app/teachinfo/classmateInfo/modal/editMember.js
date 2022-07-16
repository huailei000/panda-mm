import { XTable, XButton, XSearchInput, XPagination, XModal, XIcon } from 'xcomponents'
import { $_date, $_toast, $_conf } from 'services'
import { BMemberTemp } from 'bcomponents'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Api from '../services'
import { BNoData, BLoading } from 'bcomponents';

class EditMember extends Component {
    static defaultProps = {
        studentsDate: [],
        student: []
    }
    constructor(props) {
        super(props)
        const student = props.data.student ? props.data.student : [];
        this.iSave = false;
        this.pages = {
            size: 500,
            page: 1
        }
        this.state = {
            studentName: '',
            copyData: [],
            allStudent: [],
            addStudent: student,
            setAddStudent: new Set(student),
            pages: this.pages,
            count: 0,
            isLoading: false,
        }
    }
    componentDidMount() {
        this.getStadent(this.state.pages, this.state.studentName)
    }
    getStadent(params, name) {
        this.setState({
            isLoading: true,
        })
        const options = {
            ...params,
            name
        }
        Api.students(options)
            .then(res => {
                this.setState({
                    allStudent: [...res.data.list],
                    copyData: res.data.list,
                    count: res.page.count
                })
                this.setState({
                    isLoading: false,
                })
            })
            .catch(err => {
                $_toast(err.desc)
                this.setState({
                    isLoading: false,
                })
            })
    }
    successEdit() {
        // this.props.successEdit(this.state.addStudent);
        this.props.confirm(this.state.addStudent)
    }
    clear() {
        this.pages.page = 1
        this.setState({
            pages: this.pages
        })
        this.getStadent(this.pages, '')
    }
    searchStu(name) {
        this.pages.page = 1
        this.setState({
            pages: this.pages
        })
        this.getStadent(this.pages, name)
    }
    addStudent(data) {
        const { setAddStudent } = this.state;
        this.iSave = true;
        if (!setAddStudent.has(data)) {
            data.disabled = true
            setAddStudent.add(data)
        } else {
            setAddStudent.delete(data)
        }
        this.setState({
            addStudent: Array.from(setAddStudent)
        })
    }
    closeStudent(data) {
        const { allStudent } = this.state
        this.addStudent(data)
        const index = allStudent.findIndex(item => item.id === data.id)
        allStudent[index].disabled = false
        this.setState({
            allStudent
        })
    }
    closeEmitMember() {
        // this.props.closeEmitMember();
        if (this.iSave) {
            XModal.Confirm({
                size: 'sm',
                title: '是否继续编辑',
                msg: '您有未保存的修改，是否继续编辑？',
                confirmText: '继续',
                cancelText: '放弃'
            }).then(
                res => {

                },
                res => {
                    this.props.cancel()
                }
            )
        } else {
            this.props.cancel()
        }
    }
    pageChange(page) {
        this.pages.page = page
        this.setState({
            pages: this.pages
        })
        this.getStadent(this.pages)
    }
    render() {
        let { allStudent, addStudent } = this.state
        const { confirm, cancel, data } = this.props
        return (
            <XModal.Body className="editMemberDiaklog">
                <div className="editMember">
                    <div
                        className="back"
                        onClick={this.closeEmitMember.bind(this)}>
                        <XIcon type="times"
                            className="close-btn"
                        />
                    </div>
                    <div className="editMemberContainer">
                        <div className="addMember">
                            <p className="title">{data.name || ''}</p>
                            <div className="addArea addArea-1">
                                {addStudent.length === 0
                                    ? <BNoData msg="添加班级成员"></BNoData>
                                    : addStudent.map(item => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="addStudent"
                                        >
                                            <BMemberTemp
                                                icon="close"
                                                name={item.name}
                                                number={$_date
                                                    .init(
                                                        'YYYY-MM-DD',
                                                        item.create_time * 1000
                                                    )
                                                    .split('-')
                                                    .join('')}
                                                imgSrc={
                                                    item.photos.length !== 0
                                                        ? `${
                                                              $_conf.preLoadAddr
                                                          }${
                                                              item.photos[0].url
                                                          }`
                                                        : require('../../../../../assets/avatar.jpg')
                                                }
                                                onClick={this.closeStudent.bind(
                                                    this,
                                                    item
                                                )}
                                            />
                                            {/* <BMemberTemp icon="close" name='李小二' number ='20180909' imgSrc='https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D220/sign=53b23d9e750e0cf3a4f749f93a44f23d/a044ad345982b2b71342a94836adcbef77099b59.jpg' onClick={()=>{console.log('aaa')}}/>
                    <BMemberTemp name='李小二' number ='20180909'  disabled={true}/> */}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="allMember">
                            <div className="memberSearch">
                                <p>全部学生（{this.state.count}）</p>
                                <div>
                                    <div className="search">
                                        <XSearchInput
                                            placeholder={'搜索学生姓名'}
                                            value={this.state.studentName}
                                            size="md"
                                            onSearch={this.searchStu.bind(this)}
                                            onClear={this.clear.bind(this)}
                                        />
                                    </div>
                                    <XButton
                                        className="item"
                                        type="warning"
                                        onClick={this.successEdit.bind(this)}
                                    >
                                        完成编辑
                                    </XButton>
                                </div>
                            </div>
                            {   this.state.isLoading
                                ? <div className="editArea editArea-1">
                                     <BLoading type={"table"}/>
                                   </div>
                                : <div className="editArea editArea-1">
                                        <div className="scrollContainer">
                                            {allStudent.length === 0
                                            ? <BNoData></BNoData>
                                            : allStudent.map(item => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="student"
                                                    >
                                                        <BMemberTemp
                                                            type="all"
                                                            icon="plus"
                                                            name={item.name}
                                                            number={$_date
                                                                .init(
                                                                    'YYYY-MM-DD',
                                                                    item.create_time *
                                                                        1000
                                                                )
                                                                .split('-')
                                                                .join('')}
                                                            disabled={
                                                                this.state.addStudent.findIndex(
                                                                    list =>
                                                                        item.id ===
                                                                        list.id
                                                                ) !== -1
                                                            }
                                                            onClick={this.addStudent.bind(
                                                                this,
                                                                item
                                                            )}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="page">
                                            <XPagination
                                                count={this.state.count}
                                                currentPage={this.state.pages.page}
                                                perPage={this.state.pages.size}
                                                isAgeSize={false}
                                                onPageChange={this.pageChange.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </XModal.Body>
        )
    }
}

EditMember.propTypes = {
    ishow: PropTypes.bool
}

export default EditMember
