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
import InfoModal from './modal/info'
import EditMember from './modal/editMember'
import Api from './services'

export default class extends Component {
    state = {
        name: '',
        dataList: [],
        count: '',
        page: 1,
        size: 10,
        ishow: false,
        students: false,
        studentsDate: [],
        student: [], // 学生数据
        teacher: [],
    }

    tableConf = [
        {
            name: '班级名称',
            key: 'name'
        },
        { name: '年级', key: 'grade' },
        { name: '院系', key: 'department' },
        { name: '专业', key: 'major' },
        { name: '班级人数/人', key: 'num' },
        { name: '班主任', key: 'teacher', render: res => {
            if (res.teacher.length === 0) {
                return '-';
            }
            return res.teacher[0].name;
        } },
        {
            name: '操作',
            key: '',
            render: res => (
                <Fragment>
                    <XIcon
                        title="班级成员"
                        type="users"
                        onClick={this.emitMenmber.bind(this, res)}
                    />
                    <XIcon
                        title="查看"
                        type="eye"
                        onClick={this.infoFn.bind(this, res)}
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
    
    infoFn(data) {
        XModal.Dialog(InfoModal, {
            size: 'lg',
            data: {
                ...data,
                teacher: this.state.teacher,
            }
        }).then(
            res => {
                // this.updataTabe();
                console.log(res)
            },
            () => {}
        )
    }
    componentWillMount() {
        this.getTeachers();
    }
    getTeachers() {
        const pamars = {
            size: 100000,
            page: 1,
        }
        Api.getTeachers(pamars).then(res => {
            // this.updataTabe()
            const teachers = res.data.list.map((item) => {
                item.label = item.name;
                item.value = item.id;
                return item;
            });
            const teacher = [{
                label: '请选择',
                value: '',
            }, ...teachers]
            this.setState({
                teacher,
            });
        })
        .catch(err => {
            $_toast(err.desc, 'error')
        })
    }
    /**
     * emitMenmber
     */
    emitMenmber(res) {
        XModal.Dialog(EditMember, {
            size: 'sg',
            data: {
                student: res.students,
            }
        }).then(
            students => {
                // console.log(res);
                this.editClass(res, students)
            },
            () => {}
        )
    }
    onChangePage(page) {
        this.getStudent(null, {
            page,
            size: 20
        })
    }
    editClass(data, students) {
        // console.log(data)
        // students = students.map(item => item.id).join(',');
        // const params = {
        //     department, // 系
        //     grade, // 年级
        //     major, // 专业
        //     name, // 班级名称
        //     program, // 学制
        //     student_id: students, // 学生ID
        //     teacher_id, // 教师姓名
        // } = data;
        let params = {}
        // console.log(data.begin_time * 1000)
        params.begin_time = !!data.begin_time ? $_date.init('YYYY-MM-DD', data.begin_time * 1000) : '';
        params.code = data.code || ''
        params.department = data.department || ''
        params.grade = data.grade || ''
        params.major = data.major || ''
        params.name = data.name || ''
        params.program = data.program || ''
        params.teacher_id = data.teacher_id || ''
        params.student_id = students.map(item => item.id).join(',')
        Api.editClass(data.id, params)
            .then(res => {
                $_toast('编辑学生成功', 'info')
                this.updataTabe()
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    editFn(type, res) {
        let data = {}
        // debugger;
        if (type === 'edit') {
            data = res
        } else if (type === 'create') {
            data = {}
        }
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                ...data,
                showEmitMember: this.showEmitMember.bind(this),
                type,
                student: this.state.student,
                teacher: this.state.teacher,
            }
        }).then(
            () => {
                this.updataTabe()
            },
            () => {}
        )
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
            msg: '确认删除班级？'
        }).then(
            res => {
                this.deleteClasses(item.id)
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
    deleteClasses(id) {
        Api.deleteClasses(id)
            .then(res => {
                $_toast('删除班级成功', 'info')
                this.updataTabe()
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
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
    showEmitMember() {
        this.getStudent({
            page: 1,
            size: 20
        })
    }
    closeEmitMember() {
        this.setState({
            ishow: false
        })
    }
    /**
     * 完成编辑回调
     */
    successEdit(student) {
        this.setState({
            student: student
        })
        // console.log(this.state.student);
        this.closeEmitMember()
    }
    render() {
        return (
            <div className="classmateInfo">
                <div className="classmateInfo-header">
                    <div className="info">班级信息</div>
                    <div className="operate-info">
                        <XSearchInput
                            placeholder={'搜索班级名称'}
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
                            新建班级
                        </XButton>
                    </div>
                </div>
                <XTable
                    tableConf={this.tableConf}
                    onPageChange={this.onPageChange.bind(this)}
                    url={'classes'}
                    ref="table"
                    urlParams={this.state.name ? { name: this.state.name } : {}}
                    sequenceMap={{ time: '' }}
                />
            </div>
        )
    }
}
