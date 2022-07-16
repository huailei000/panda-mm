import React, { Component, Fragment } from 'react';
import { XTable, XInput, XButton, XIcon, XModal, XUploadBtn, XToggle } from 'xcomponents';
import { $_ajax, $_date, $_toast, $_conf } from 'services';
import { BSheet } from 'bcomponents';
import EditModal from './modal/edit';
import TipsModal from './modal/tips';
import ErrorModal from './modal/error';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@withRouter
@inject('UserStore')
@observer
export default class extends Component {
    state = {
        name: '',
        dataList: [],
        count: '',
        page: 1,
        size: 10,
        curIndex: 0,
        termIndex: 0,
        gradeIndex: 0,
        teacherIndex: null,
        roomIndex: null,
        termToggle: false,
        gradeToggle: false,
        teacherToggle: false,
        roomToggle: false,
        isEditing: false,
        yearList: [],
        termList: [],
        teacherList: [],
        gradeList: [],
        roomList: [],
        courseList: [],
        lessonList: [],
        urlParam: {
            cls_id: null,
            classroom_id: null,
            term_id: null,
            teacher_id: null
        },
        tipsObj: {
            lessonList: '缺少课程节次, 请前往教务管理设置',
            teacherList: '缺少教师信息, 请前往教务管理设置',
            gradeList: '缺少班级信息, 请前往教务管理设置',
            roomList: '缺少教室信息, 请前往教务管理设置',
            courseList: '缺少课程信息, 请前往教务管理设置'
        },
        course0: [{}, {}, {}, {}, {}, {}, {}],
        course1: [{}, {}, {}, {}, {}, {}, {}],
        course2: [{}, {}, {}, {}, {}, {}, {}],
        course3: [{}, {}, {}, {}, {}, {}, {}],
        course4: [{}, {}, {}, {}, {}, {}, {}],
        course5: [{}, {}, {}, {}, {}, {}, {}],
        course6: [{}, {}, {}, {}, {}, {}, {}],
        course7: [{}, {}, {}, {}, {}, {}, {}],
        course8: [{}, {}, {}, {}, {}, {}, {}],
        course9: [{}, {}, {}, {}, {}, {}, {}],
        course10: [{}, {}, {}, {}, {}, {}, {}],
        course11: [{}, {}, {}, {}, {}, {}, {}],
        courseConf: [],
        tabList: [
            { key: 'grade', name: '按班级查看' },
            { key: 'teacher', name: '按教师查看' },
            { key: 'room', name: '按教室查看' }
        ],
        urlIds: {
            teacher_id: null,
            cls_id: null,
            classroom_id: null
        },
        term_id: null,
        currentTerm_id: null
    }; // tabList配置

    // week配置项
    weekConf = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    objParams = {
        size: 100000,
        page: 1
    };
    editFn(obj, type = 'edit') {
        let lessonCur = this.state.courseConf.filter(item => {
            return item.index === obj.lessonIndex;
        });
        XModal.Dialog(EditModal, {
            size: 'lg',
            data: {
                yearList: this.state.yearList,
                teacherList: this.state.teacherList,
                gradeList: this.state.gradeList,
                roomList: this.state.roomList,
                courseList: this.state.courseList,
                type: type,
                lessonList: this.state.lessonList,
                weekday: obj.weekday,
                id: obj.child.id,
                lesson_id: lessonCur[0].id,
                teacher_id: obj.child.teacher_id,
                cls_id: obj.child.cls_id,
                classroom_id: obj.child.classroom_id,
                course_id: obj.child.course_id,
                curIndex: this.state.curIndex,
                gradeIndex: this.state.gradeIndex,
                teacherIndex: this.state.teacherIndex,
                roomIndex: this.state.roomIndex
            }
        }).then(() => {
            this.getLessonTables(
                Object.assign(
                    {},
                    {
                        term_id: this.state.term_id
                    },
                    this.state.urlIds
                )
            );
        });
    }

    editFinish() {
        this.setState({ isEditing: false });
    }

    editCancel() {
        XModal.Confirm({
            size: 'sm',
            title: '放弃编辑？',
            msg: (
                <Fragment>
                    <p>编辑内容未保存，是否放弃编辑？</p>
                    <p>放弃后编辑内容将无法恢复</p>
                </Fragment>
            ),
            confirmText: '继续编辑',
            cancelText: '放弃编辑'
        }).then(
            res => {
                this.getLessonTables(
                    Object.assign(
                        {},
                        {
                            term_id: this.state.term_id
                        },
                        this.state.urlIds
                    )
                );
            },
            res => {
                if (res === 'cancel') {
                    this.setState({
                        isEditing: false
                    });
                }
            }
        );
    }

    // 编辑内容
    editInfo() {
        if (this.checkInfo()) {
            this.errorFn(this.checkInfo());
            return;
        } else {
            this.setState({ isEditing: true });
        }
    }

    // Tips
    errorFn(arr) {
        XModal.Dialog(ErrorModal, {
            size: 'sm',
            data: {
                arr: arr
            }
        }).then(() => {});
    }

    // 设置
    setupFn(name, route) {
        XModal.Dialog(TipsModal, {
            size: 'sm',
            data: {
                name: name ? name : ''
            }
        }).then(() => {
            this.props.history.$push(route ? `teachinfo/${route}` : 'teachinfo/courseNum');
        });
    }

    //删除
    deleteFn(item) {
        XModal.Confirm({
            size: 'sm',
            title: '确认删除？',
            msg: (
                <Fragment>
                    <p>确认删除课程？</p>
                </Fragment>
            )
        }).then(
            res => {
                $_ajax.delete(`info/lessontable/${item.id}`).then(res => {
                    $_toast('删除成功！');
                    this.getLessonTables(
                        Object.assign(
                            {},
                            {
                                term_id: this.state.term_id
                            },
                            this.state.urlIds
                        )
                    );
                });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    handleKeyDown(res) {
        this.setState({ name: res });
    }

    clear() {
        this.setState({ name: '' });
    }

    onFinished() {
        this.props.history.$reload();
    }

    onDownLoadTemp() {
        if (this.checkInfo()) {
            this.errorFn(this.checkInfo());
            return;
        } else {
            $_ajax.get('import/get/6').then(
                res => {
                    window.open($_conf.preLoadAddr + res.data.support_list[0].example_file);
                },
                res => {
                    $_toast('获取模版失败！');
                }
            );
        }
    }

    checkInfo() {
        let tipArr = [];
        this.state.lessonList.length === 0 && tipArr.push(this.state.tipsObj.lessonList);
        this.state.teacherList.length === 0 && tipArr.push(this.state.tipsObj.teacherList);
        this.state.gradeList.length === 0 && tipArr.push(this.state.tipsObj.gradeList);
        this.state.roomList.length === 0 && tipArr.push(this.state.tipsObj.roomList);
        this.state.courseList.length === 0 && tipArr.push(this.state.tipsObj.courseList);
        if (tipArr.length > 0) {
            return tipArr;
        } else {
            return false;
        }
    }

    changeTerm() {
        this.setState({
            termToggle: !this.state.termToggle,
            gradeToggle: false,
            teacherToggle: false,
            roomToggle: false
        });
    }

    changeTabs(type, index) {
        let objRoute = {
            teacher: 'teacher',
            grade: 'classmateInfo',
            room: 'classroom'
        };
        if (this.state[`${type}List`].length === 0) {
            this.setupFn(type, objRoute[type]);
            return;
        } else {
            if (index === this.state.curIndex) {
                this.setState({
                    termToggle: false,
                    [`${type}Toggle`]: !this.state[`${type}Toggle`]
                });
            } else {
                let objType = {
                    grade: 'cls',
                    teacher: 'teacher',
                    room: 'classroom'
                };
                let urlIds = {
                    teacher_id: null,
                    cls_id: null,
                    classroom_id: null
                };
                urlIds[`${objType[type]}_id`] = this.state[`${type}List`][0].id;
                this.getLessonTables(
                    Object.assign(
                        {},
                        {
                            term_id: this.state.term_id
                        },
                        urlIds
                    )
                );
                this.setState({
                    termToggle: false,
                    [`${type}Toggle`]: false,
                    curIndex: index,
                    urlIds: urlIds
                });
                let typeArr = ['grade', 'teacher', 'room'];
                typeArr.forEach(item => {
                    if (item === type) {
                        this.setState({
                            [`${item}Index`]: 0
                        });
                    } else {
                        this.setState({
                            [`${item}Index`]: null
                        });
                    }
                });
            }
        }
    }

    // 选择菜单关闭
    closeToggleBox(type) {
        this.setState({
            [`${type}Toggle`]: false
        });
    }

    itemTermClick(obj, index) {
        this.getLessons({ term_id: obj.id });
        this.getLessonTables(
            Object.assign(
                {},
                {
                    term_id: obj.id
                },
                this.state.urlIds
            )
        );
        this.setState({
            termIndex: index,
            term_id: obj.id
        });
    }

    itemClick(obj, item, index) {
        let objType = { grade: 'cls', teacher: 'teacher', room: 'classroom' };
        let urlIds = {
            teacher_id: null,
            cls_id: null,
            classroom_id: null
        };
        urlIds[`${objType[obj.key]}_id`] = item.id;
        this.getLessonTables(
            Object.assign(
                {},
                {
                    term_id: this.state.term_id
                },
                urlIds
            )
        );
        this.setState({
            [`${obj.key}Index`]: index,
            urlIds: urlIds
        });
    }

    // 获取列表信息
    getLessonTables(params = {}) {
        let _this = this;
        let urlParam = Object.assign({}, params, { detail: true }, this.objParams);
        let courseObj = {
            course0: [{}, {}, {}, {}, {}, {}, {}],
            course1: [{}, {}, {}, {}, {}, {}, {}],
            course2: [{}, {}, {}, {}, {}, {}, {}],
            course3: [{}, {}, {}, {}, {}, {}, {}],
            course4: [{}, {}, {}, {}, {}, {}, {}],
            course5: [{}, {}, {}, {}, {}, {}, {}],
            course6: [{}, {}, {}, {}, {}, {}, {}],
            course7: [{}, {}, {}, {}, {}, {}, {}],
            course8: [{}, {}, {}, {}, {}, {}, {}],
            course9: [{}, {}, {}, {}, {}, {}, {}],
            course10: [{}, {}, {}, {}, {}, {}, {}],
            course11: [{}, {}, {}, {}, {}, {}, {}]
        };
        $_ajax.get('info/lessontables', urlParam).then(
            res => {
                res.data &&
                    res.data.list &&
                    res.data.list.sort((a, b) => {
                        if (a.lesson_index.num > b.lesson_index.num) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                res.data.list.forEach((item, index) => {
                    item.lesson_index.num && item.lesson_index.num < 13
                        ? (courseObj[`course${item.lesson_index.num - 1}`][item.weekday] = {
                              id: item.id,
                              cls_id: item.cls.id,
                              teacher_id: item.teacher.id,
                              classroom_id: item.classroom.id,
                              course_id: item.course.id,
                              lesson_id: item.lesson_index.id,
                              name: item.course && item.course.name ? `${item.course.code}${item.course.name}` : '暂无',
                              site:
                                  item.classroom && item.classroom.location
                                      ? `${item.classroom.location}${item.classroom.name}`
                                      : '暂无',
                              class: item.cls && item.cls.name ? `${item.cls.grade}${item.cls.name}` : '暂无',
                              teach: item.teacher && item.teacher.name ? item.teacher.name : '暂无',
                              num: item.cls && item.cls.num ? `${item.cls.num}` : 0
                          })
                        : {};
                });
                _this.setState({
                    course0: courseObj.course0,
                    course1: courseObj.course1,
                    course2: courseObj.course2,
                    course3: courseObj.course3,
                    course4: courseObj.course4,
                    course5: courseObj.course5,
                    course6: courseObj.course6,
                    course7: courseObj.course7,
                    course8: courseObj.course8,
                    course9: courseObj.course9,
                    course10: courseObj.course10,
                    course11: courseObj.course11
                });
            },
            res => {
                // if (res.desc) {
                //     $_toast(res.desc);
                // }
            }
        );
    }

    // 获取学年列表
    getTerms() {
        let termList = [];
        let yearList = [];
        $_ajax.get('info/terms', this.objParams).then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        termList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.term_year} ${item.term}`
                            })
                        );
                        yearList.push(item);
                    });
                yearList = Array.from(new Set(yearList));
                termList = Array.from(new Set(termList)).map(item => {
                    return JSON.parse(item);
                });
                const currentId = this.props.UserStore.user.current_term_id;
                const termIdx = termList.findIndex(term => term.id === currentId);
                this.setState({
                    yearList: yearList,
                    termList: termList,
                    term_id: termList[0] ? currentId : null,
                    termIndex: termIdx === -1 ? 0 : termIdx
                });
                // 获取教室列表
                this.getRooms();
                // 获取教师列表
                this.getTeachers();
                // 获取班级
                this.getGrades(termList);
                // 获取课程
                this.getCourses();
                // 获取课节
                this.getLessons({ term_id: termList[0] ? currentId : null });
                // 获取当前的学期
                this.currentTerm(termList);
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取教师列表
    getTeachers() {
        let teacherList = [];
        $_ajax.get('teachers', this.objParams).then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        teacherList.push(
                            JSON.stringify({
                                id: item.id,
                                name: item.name
                            })
                        );
                    });
                teacherList = Array.from(new Set(teacherList)).map(item => {
                    return JSON.parse(item);
                });
                this.setState({ teacherList: teacherList });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取班级列表
    getGrades(termList) {
        let _this = this;
        let gradeList = [];
        let urlIds = {
            teacher_id: null,
            cls_id: null,
            classroom_id: null
        };
        $_ajax.get('classes', this.objParams).then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        gradeList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.grade} ${item.name}`
                            })
                        );
                    });
                gradeList = Array.from(new Set(gradeList)).map(item => {
                    return JSON.parse(item);
                });
                urlIds.cls_id = gradeList[0] ? gradeList[0].id : null;
                this.setState({
                    gradeList: gradeList,
                    cls_id: gradeList[0] ? gradeList[0].id : null,
                    urlIds: urlIds
                });
                _this.getLessonTables({
                    term_id: termList[0] ? termList[0].id : null,
                    cls_id: gradeList[0] ? gradeList[0].id : null
                });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取教室列表
    getRooms() {
        let roomList = [];
        $_ajax.get('info/classrooms', this.objParams).then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        roomList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.location} ${item.name}`
                            })
                        );
                    });
                roomList = Array.from(new Set(roomList)).map(item => {
                    return JSON.parse(item);
                });
                this.setState({ roomList: roomList });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取课程列表
    getCourses() {
        let courseList = [];
        $_ajax.get('info/courses', this.objParams).then(
            res => {
                res.data &&
                    res.data.list.forEach(item => {
                        courseList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.code}${item.name}`
                            })
                        );
                    });
                courseList = Array.from(new Set(courseList)).map(item => {
                    return JSON.parse(item);
                });
                this.setState({ courseList: courseList });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取课节列表
    getLessons(obj = {}) {
        let lessonList = [];
        let lessonIndexArr = [
            '第一节',
            '第二节',
            '第三节',
            '第四节',
            '第五节',
            '第六节',
            '第七节',
            '第八节',
            '第九节',
            '第十节',
            '第十一节',
            '第十二节'
        ];
        let courseConf = [];
        $_ajax.get('info/lessonindexs', Object.assign({}, this.objParams, obj)).then(
            res => {
                res.data &&
                    res.data.list.sort((a, b) => {
                        if (a.num > b.num) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }) &&
                    res.data.list.forEach((item, index) => {
                        lessonList.push(
                            JSON.stringify({
                                id: item.id,
                                name: `${item.start_hour < 10 ? `0${item.start_hour}` : item.start_hour}:${
                                    item.start_min < 10 ? `0${item.start_min}` : item.start_min
                                }
                                ~${item.end_hour < 10 ? `0${item.end_hour}` : item.end_hour}:${
                                    item.end_min < 10 ? `0${item.end_min}` : item.end_min
                                }`
                            })
                        );
                        courseConf.push(
                            JSON.stringify({
                                id: item.id,
                                num: lessonIndexArr[item.num - 1],
                                index: item.num - 1,
                                time: `${item.start_hour < 10 ? `0${item.start_hour}` : item.start_hour}:${
                                    item.start_min < 10 ? `0${item.start_min}` : item.start_min
                                }
                                ~${item.end_hour < 10 ? `0${item.end_hour}` : item.end_hour}:${
                                    item.end_min < 10 ? `0${item.end_min}` : item.end_min
                                }`
                            })
                        );
                    });
                if (!res.data || !res.data.list || res.data.list.length === 0) {
                    this.setupFn();
                }
                lessonList = Array.from(new Set(lessonList)).map(item => {
                    return JSON.parse(item);
                });
                courseConf = Array.from(new Set(courseConf)).map(item => {
                    return JSON.parse(item);
                });
                this.setState({ lessonList: lessonList, courseConf: courseConf });
            },
            res => {
                if (res.desc) {
                    $_toast(res.desc);
                }
            }
        );
    }

    // 获取当前学期学年
    currentTerm(termList) {
        $_ajax.get('get/term', {
            time: $_date.init('YYYY-MM-DD', new Date())
        }).then((res) => {
            let curTermIndex = 0;
            if (termList && termList.length) {
                termList.forEach((item, index) => {
                    curTermIndex = res.data.id === item.id ? index : 0;
                })
            }
            this.setState({
                currentTerm_id: res.data.id,
                termIndex: curTermIndex
            })
        })
    }

    componentDidMount() {
        // 获取学年
        this.getTerms();
    }

    render() {
        return (
            <div className="sheetmanage">
                <div className="sheetmanage-header">
                    {this.state.termList && this.state.termList.length > 0 ? (
                        <div className="term-list" onClick={this.changeTerm.bind(this)}>
                            <XToggle onClose={this.closeToggleBox.bind(this, 'term')}>
                                <XToggle.Top>
                                    <span className="info">
                                        {
                                            this.state.termList[parseInt(this.state.termIndex)].name
                                        }
                                    </span>
                                    <XIcon
                                        type="caret-down"
                                        className={`icon-toggle ${this.state.termToggle ? 'up-icon' : ''}`}
                                    />
                                </XToggle.Top>
                                <XToggle.Box>
                                    <div className="search-content">
                                        {this.state.termList.map((child, i) => {
                                            return (
                                                <div
                                                    key={`term${i}`}
                                                    onClick={this.itemTermClick.bind(this, child, i)}
                                                    className={`${i === this.state.termIndex ? 'active' : ''}`}
                                                >
                                                    {child.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </XToggle.Box>
                            </XToggle>
                        </div>
                    ) : null}
                    <ul className="dimension-list">
                        {this.state.tabList.map((item, index) => {
                            return (
                                <li
                                    key={`tab${index}`}
                                    onClick={this.changeTabs.bind(this, item.key, index)}
                                    className={`${
                                        index === this.state.curIndex && this.state[`${item.key}List`].length > 0
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    <span>
                                        {this.state[`${item.key}Index`] === null
                                            ? item.name
                                            : this.state[`${item.key}List`] && this.state[`${item.key}List`].length > 0
                                            ? this.state[`${item.key}List`][parseInt(this.state[`${item.key}Index`])]
                                                  .name
                                            : item.name}
                                    </span>
                                    <XToggle onClose={this.closeToggleBox.bind(this, `${item.key}`)}>
                                        <XToggle.Top>
                                            <XIcon
                                                type="caret-down"
                                                className={`icon-toggle ${
                                                    index !== this.state.curIndex ||
                                                    this.state[`${item.key}List`].length === 0
                                                        ? 'display-none'
                                                        : ''
                                                } ${
                                                    this.state[`${item.key}Toggle`] &&
                                                    this.state[`${item.key}List`].length > 0
                                                        ? 'up-icon'
                                                        : ''
                                                }`}
                                            />
                                        </XToggle.Top>
                                        <XToggle.Box>
                                            <div className="search-content">
                                                {this.state[`${item.key}List`] &&
                                                this.state[`${item.key}List`].length > 0
                                                    ? this.state[`${item.key}List`].map((child, i) => {
                                                          return (
                                                              <span
                                                                  key={`${item.key}${i}`}
                                                                  onClick={this.itemClick.bind(this, item, child, i)}
                                                                  className={`teacher-name ${
                                                                      i === this.state[`${item.key}Index`]
                                                                          ? 'search-teach'
                                                                          : ''
                                                                  }`}
                                                              >
                                                                  {child.name}
                                                              </span>
                                                          );
                                                      })
                                                    : null}
                                            </div>
                                        </XToggle.Box>
                                    </XToggle>
                                </li>
                            );
                        })}
                    </ul>
                    {this.state.isEditing ? (
                        <div className="operate-edit">
                            <XButton className="item" onClick={this.editFinish.bind(this, 'create')}>
                                编辑完成
                            </XButton>
                            {/* <XButton
                                className="item"
                                onClick={this.editCancel.bind(this, 'create')}
                            >
                                取消编辑
                            </XButton> */}
                        </div>
                    ) : (
                        <div className="operate-info">
                            <XButton className="item" onClick={this.editInfo.bind(this, 'create')}>
                                编辑课表
                            </XButton>
                            {/* {!this.checkInfo() ? (
                                <XUploadBtn
                                    onFinished={this.onFinished.bind(this)}
                                    onDownLoadTemp={this.onDownLoadTemp.bind(this)}
                                />
                            ) : null} */}
                        </div>
                    )}
                </div>
                {this.state.courseConf.length ? (
                    <BSheet>
                        <BSheet.Row>
                            <BSheet.Empty />
                            {this.weekConf.map((item, index) => {
                                return <BSheet.Week val={item} key={`week${index}`} />;
                            })}
                        </BSheet.Row>
                        {this.state.courseConf.map((item, index) => {
                            return (
                                <Fragment key={`row${index}`}>
                                    <BSheet.Row>
                                        <BSheet.Course val={item.num} time={item.time} key={`course${index}`} />
                                        {this.state[`course${item.index}`].map((child, i) => {
                                            return JSON.stringify(child) !== '{}' ? (
                                                this.state.curIndex === 0 ? (
                                                    <BSheet.Normal
                                                        val={child.name}
                                                        site={child.site}
                                                        teach={`教师 ${child.teach}`}
                                                        num={`人数 ${child.num}`}
                                                        state={this.state.isEditing}
                                                        onChange={() => {
                                                            this.editFn({
                                                                weekday: i,
                                                                lessonIndex: item.index,
                                                                child: child
                                                            });
                                                        }}
                                                        onDelete={() => {
                                                            this.deleteFn(child);
                                                        }}
                                                        key={`normal${i}`}
                                                    />
                                                ) : this.state.curIndex === 1 ? (
                                                    <BSheet.Normal
                                                        val={child.site}
                                                        site={child.class}
                                                        teach={`课程 ${child.name}`}
                                                        num={`人数 ${child.num}`}
                                                        state={this.state.isEditing}
                                                        onChange={() => {
                                                            this.editFn({
                                                                weekday: i,
                                                                lessonIndex: item.index,
                                                                child: child
                                                            });
                                                        }}
                                                        onDelete={() => {
                                                            this.deleteFn(child);
                                                        }}
                                                        key={`normal${i}`}
                                                    />
                                                ) : (
                                                    <BSheet.Normal
                                                        val={child.class}
                                                        site={child.name}
                                                        teach={`教师 ${child.teach}`}
                                                        num={`人数 ${child.num}`}
                                                        state={this.state.isEditing}
                                                        onChange={() => {
                                                            this.editFn({
                                                                weekday: i,
                                                                lessonIndex: item.index,
                                                                child: child
                                                            });
                                                        }}
                                                        onDelete={() => {
                                                            this.deleteFn(child);
                                                        }}
                                                        key={`normal${i}`}
                                                    />
                                                )
                                            ) : (
                                                <BSheet.Void
                                                    key={`void${index}${i}`}
                                                    state={this.state.isEditing}
                                                    onChange={() => {
                                                        this.editFn(
                                                            {
                                                                weekday: i,
                                                                lessonIndex: item.index,
                                                                child: child
                                                            },
                                                            'create'
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                    </BSheet.Row>
                                    {index === 3 || index === 7 ? <BSheet.Line key={`line${index}`} /> : null}
                                </Fragment>
                            );
                        })}
                    </BSheet>
                ) : null}
            </div>
        );
    }
}
