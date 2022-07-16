import { XTable, XButton, XSearchInput, XIcon, XModal } from 'xcomponents'
import { $_date } from 'services'
import { BMemberTemp } from 'bcomponents'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class EditMember extends Component {
    static defaultProps = {
        studentsDate: [],
        student: [],
    }
    constructor(props) {
        super(props)
        let { studentsDate, student } = props
        const allStudent = JSON.parse(JSON.stringify(studentsDate))
        student = JSON.parse(JSON.stringify(student))
        allStudent.map(item => {
            const i = student.findIndex(list => item.id === list.item)
            if (i !== -1) {
                item.disabled = true
            } else {
                item.disabled = false
            }
            item.ishow = true
            return item
        })
        this.state = {
            studentName: '',
            copyData: allStudent,
            allStudent,
            addStudent: [],
            setAddStudent: new Set(),
        }
    }
    successEdit() {
        this.props.successEdit(this.state.addStudent)
    }
    closeEdit() {}
    searchStu(str) {
        const { allStudent } = this.state
        allStudent.map(item => {
            if (str === '') {
                item.ishow = true
            } else if (
                new RegExp(`${item.name}`, 'i').test(str) &&
                str !== ''
            ) {
                item.ishow = true
            } else {
                item.ishow = false
            }
            return item
        })
        // console.log(allStudent);
        this.setState({
            allStudent
        })
    }
    addStudent(data) {
        const { setAddStudent } = this.state
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
        this.props.closeEmitMember()
    }
    render() {
        let { allStudent, addStudent } = this.state
        return (
            <div className="editMember">
                <div className="back" onClick={this.closeEmitMember.bind(this)}>
                    返回
                </div>
                <div className="editMemberContainer">
                    <div className="addMember">
                        <p className="title">一年级一班（40人）</p>
                        <div className="addArea">
                            {addStudent.map(item => {
                                return (
                                    <div key={item.id} className="addStudent">
                                        <BMemberTemp
                                            icon="close"
                                            name={item.name}
                                            number={$_date.init(
                                                'YYYY-MM-DD',
                                                item.create_time * 1000
                                            )}
                                            imgSrc={
                                                item.photos.length !== 0
                                                    ? item.photos[0].url
                                                    : ''
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
                            <p>全部学生（1000人）</p>
                            <div>
                                <div className="search">
                                    <XSearchInput
                                        placeholder={'搜索学生姓名'}
                                        value={this.state.studentName}
                                        size="md"
                                        onSearch={this.searchStu.bind(this)}
                                        // onClear={this.clear.bind(this)}
                                    />
                                </div>
                                <XButton
                                    className="item"
                                    onClick={this.successEdit.bind(this)}
                                >
                                    完成编辑
                                </XButton>
                            </div>
                        </div>
                        <div className="editArea">
                            {allStudent.map(item => {
                                return (
                                    <div
                                        key={item.id}
                                        className={`student ${
                                            !item.ishow ? 'ishow' : ''
                                        }`}
                                    >
                                        <BMemberTemp
                                            type="all"
                                            icon="plus"
                                            name={item.name}
                                            number={$_date.init(
                                                'YYYY-MM-DD',
                                                item.create_time * 1000
                                            )}
                                            disabled={item.disabled}
                                            onClick={this.addStudent.bind(
                                                this,
                                                item
                                            )}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

EditMember.propTypes = {
    ishow: PropTypes.bool
}

export default EditMember
