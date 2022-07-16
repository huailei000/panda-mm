import React, { Component } from 'react'
import CardContainer from '../component/cardConrainer'
import { $_ajax, $_date, $_toast,$_conf } from 'services'
import Api from './services'
import echarts from 'echarts'
import { XDatePickerInput, XButton, XSelector, XModal } from 'xcomponents';
import { BNoData, BLoading } from 'bcomponents';

const defaultImg = require('../../../../assets/avatar.jpg');
class ClassmateAttend extends Component {
    constructor(props) {
        super(props)
        this.termName = ''
        this.time = $_date.init('YYYY-MM-DD', new Date())
        this.classess = ''
        this.calssNames = ''
        this.isloading = false;
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
            '第十节课'
        ]
        this.state = {
            students: [],
            classSelect: [],
            classSelectValue: '',
            timetableSelect: [],
            timetableSelectValue: '',
            lessonindexSelect: [],
            lessonindexSelectValue: [],
            attendance_date: $_date.init('YYYY-MM-DD', new Date()),
            cls: {},
            termName: '',
            time: '',
            classess: '',
            msg: '请选择需要查询的班级、时间以及课节',
            isLoading: false,
        }
    }
    option = {
        tooltip: {},
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 50
        },
        series: [
            {
                name: '',
                type: 'pie',
                // radius: '55%',
                // center: ['50%', '60%'],
                label: {
                    show: false
                },
                data: [
                    {
                        value: 0,
                        name: '未到人数',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#FFAFC1' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#FFC4AA' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    {
                        value: 0,
                        name: '实到人数',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#9AEBFF' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#7787FF' // 100% 处的颜色
                                    }
                                ],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    myChart = null
    componentWillMount() {
        this.getClasses()
    }
    componentDidMount() {
        this.myChart = echarts.init(this.refs.pie);
        this.pieDom();
    }
    getClasses() {
        const parmas = {
            page: 1,
            size: 1000000
        }
        Api.getClasses(parmas)
            .then(res => {
                if (res.data.list.length === 0) {
                    // $_toast('请前往班级信息创建班级', 'info');
                    return;
                }
                const classSelect = res.data.list.map((item, index) => {
                    item.label = item.name
                    item.value = item.id
                    if (index === 0) {
                        this.setState({
                            classSelectValue: item.id
                        })
                    }
                    return item
                })
                this.setState({
                    classSelect
                })
                const time = this.state.attendance_date;
                const options = {
                    cls_id: res.data.list[0].id,
                    detail: true,
                    time,
                }
                this.getLessontables(options, true)
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
    // 课表
    getLessontables(parmas, isSearch) {
        Api.getLessontables(parmas)
            .then(res => {
                if (res.data.list.length === 0) {
                    this.setState({
                        timetableSelect: [],
                        timetableSelectValue: '',
                    });
                    // $_toast('此班级列表没有对应的课程请前往表管理进行创建或者选择其他班级进行搜索', 'info');
                    return;
                };
                const fliterData = res.data.list.sort((a, b) => a.lesson_index.num - b.lesson_index.num);
                const timetableSelect = fliterData.map((item, index) => {
                    const o = {}
                    const { course, lesson_index } = item;
                    o.label = `${this.fliterTime(lesson_index.start_hour)}:${this.fliterTime(lesson_index.start_min)}-${this.fliterTime(lesson_index.end_hour)}:${this.fliterTime(lesson_index.end_min)} ${course.name || '-'}`
                    o.value = item.lesson_index.id;
                    if (index === 0) {
                        this.setState({
                            timetableSelectValue: o.value,
                        });
                        this.timeLesson = o.label;
                    }
                    return o;
                });
                this.setState({
                    timetableSelect
                });
                if (!isSearch) return;
                const {
                    attendance_date,
                    classSelectValue,
                } = this.state;
                const params = {
                    classSelectValue: classSelectValue || '',
                    timetableSelectValue: timetableSelect[0].value || '',
                    attendance_date,
                }
                this.search(params);
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    // 课节信息
    getLessonindex(parmas, cls_id) {
        Api.getLessonindex(parmas)
            .then(res => {
                if (res.data.list.length === 0) return
                const lessonindexSelect = res.data.list.map((item, index) => {
                    item.label = `${this.fliterTime(
                        item.start_hour
                    )}:${this.fliterTime(item.start_min)}-${this.fliterTime(
                        item.end_hour
                    )}:${this.fliterTime(item.end_min)} ${
                        this.configCourse[item.num]
                            ? this.configCourse[item.num]
                            : '-'
                    }-${item.term.term}`
                    item.value = item.id
                    if (index === 0) {
                        this.setState({
                            lessonindexSelectValue: item.id
                        })
                    }
                    return item
                })
                this.setState({
                    lessonindexSelect
                })
                const {
                    attendance_date,
                    classSelectValue,
                } = this.state
                const params = {
                    classSelectValue: classSelectValue,
                    lessonindexSelectValue: res.data.list[0].id,
                    attendance_date,
                }
                this.search(params);
            })
            .catch(err => {
                $_toast(err.desc, 'error')
            })
    }
    getCourse(params) {
        if (this.isloading) return;
        this.isloading = true;
        this.setState({
            isLoading: this.isloading,
        });
        Api.getCourse(params)
            .then(res => {
                let shidao = 0
                let cls = {
                    termName: '',
                    tearchName: '',
                    time: '',
                    timeLesson: '',
                    classRoom: '',
                    courseTeacherName: '',
                    shidao: 0,
                    students_num: 0,
                }
                const { list } = res.data;
                if (list.length > 0) {
                    list[0].list.forEach(item => {
                        if (item.attendance_status === 1) {
                            shidao += 1
                        }
                    })
                    cls.shidao = shidao;
                    cls.students_num = list[0].students_num
                    this.option.series[0].data[1].value = shidao
                    this.option.series[0].data[0].value = cls.students_num - shidao
                    this.option.series[0].name = this.calssNames
                    cls.tearchName = list[0].cls.teacher[0].name;
                    cls.termName = `${list[0].lesson_index.term.term_year}-${list[0].lesson_index.term.term}`;
                    cls.time = this.time;
                    cls.timeLesson = this.timeLesson;
                    cls.classRoom = list[0].classroom.name;
                    cls.courseTeacherName = list[0].course_teacher.name;
                } else {
                    this.option.series[0].data[1].value = 0
                    this.option.series[0].data[0].value = 0
                }
                this.pieDom()
                this.setState({
                    students: list.length > 0 ? list[0].list : [],
                    cls,
                    termName: this.termName,
                    time: this.time,
                    classess: this.classess,
                    isLoading: false,
                })
                this.isloading = false;
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                })
                this.isloading = false;
                $_toast(err.desc, 'error')
            })
    }
    pieDom() {
        this.myChart.setOption(this.option)
    }
    search(data) {
        let dataParams = null
        if (data) {
            dataParams = data;
        } else {
            dataParams = this.state;
        }
        const {
            attendance_date,
            classSelectValue,
            timetableSelectValue
        } = dataParams;
        if (classSelectValue === '') {
            $_toast('请选择查询班级', 'info');
            return;
        } else if (timetableSelectValue === '') {
            $_toast('请选择查询课节', 'info');
            return;
        }
        // debugger;
        this.setState({
            msg: '暂无该课程考勤结果',
        });
        const params = {
            end_time: attendance_date,
            start_time: attendance_date,
            cls_id: classSelectValue,
            lessonindex_id: timetableSelectValue,
            // detail: true,
        }
        this.getCourse(params)
    }
    classesChange(res) {
        this.setState({
            classSelectValue: res.id,
            timetableSelectValue: '',
            timetableSelect: [],
        });
        this.timeLesson = '';
        const time = this.state.attendance_date;
        this.getLessontables({
            cls_id: res.id,
            detail: true,
            time,
        }, false)
    }
    dateChange(res) {
        const attendance_date = $_date.init(
            'YYYY-MM-DD',
            res
        );
        this.setState({
            attendance_date,
            timetableSelectValue: '',
            timetableSelect: [],
        })
        this.timeLesson = '';
        this.time = attendance_date;
        const time = attendance_date;
        const options = {
            cls_id: this.state.classSelectValue,
            detail: true,
            time,
        }
        this.getLessontables(options, false)
    }
    render() {
        const { cls, termName, time, classess, isLoading } = this.state
        return (
            <div className="classmateAttend">
                <div className="classmateAttend-header">
                    <div className="classSelect">
                        <XSelector
                            options={this.state.classSelect}
                            defaultValue={this.state.classSelectValue}
                            onChange={this.classesChange.bind(this)}
                        />
                    </div>
                    <div className="classTime">
                        <XDatePickerInput
                            value={new Date()}
                            dateFormat={'YYYY-MM-DD'}
                            placeholder="请选择时间"
                            onChange={this.dateChange.bind(this)}
                        />
                    </div>
                    <div className="timetableSelect">
                        <XSelector
                            options={this.state.timetableSelect}
                            defaultValue={this.state.timetableSelectValue}
                            onChange={res => {
                                this.setState({
                                    timetableSelectValue: res.value
                                })
                                this.timeLesson = res.label;
                                // this.classess = res.id
                            }}
                        />
                    </div>
                    {/* <div className="timetableSelect">
                        <XSelector
                            options={this.state.lessonindexSelect}
                            defaultValue={this.state.lessonindexSelectValue}
                            onChange={res => {
                                this.setState({
                                    lessonindexSelectValue: res.id
                                })
                                this.termName = res.term.term
                            }}
                        />
                    </div> */}
                    <XButton type={'primary'} onClick={this.search.bind(this, null)}>
                        搜索
                    </XButton>
                </div>
                <div className="classmateAttend-container">
                    <div className="left">
                        <div className="classInfo">
                            <h3 className="classesName">{cls.name}</h3>
                            <div className="information">
                                <span className="tit">班主任</span>
                                <span className="content">
                                    {cls.tearchName || '-'}
                                </span>
                            </div>
                            <div className="information marg">
                                <span className="tit">班级人数</span>
                                <span className="content">
                                    {cls.students_num || '-'}
                                </span>
                            </div>
                            <div className="information">
                                <span className="tit">查询学期</span>
                                <span className="content">
                                    {cls.termName || '-'}
                                </span>
                            </div>
                            <div className="information">
                                <span className="tit">查询周期</span>
                                <span className="content">{cls.time || '-'}</span>
                            </div>
                            <div className="information">
                                <span className="tit">时段课程</span>
                                <span className="content">
                                    {cls.timeLesson || '-'}
                                </span>
                            </div>
                            <div className="information">
                                <span className="tit">上课教室</span>
                                <span className="content">{ cls.classRoom || '-'}</span>
                            </div>
                            <div className="information">
                                <span className="tit">任课教师</span>
                                <span className="content">{ cls.courseTeacherName || '-' }</span>
                            </div>
                        </div>
                        <div className="ech">
                            <div className="pie" ref="pie" />
                            <div className="text">
                                <p className="all">
                                    应到：{cls.students_num || 0}人
                                </p>
                                <p className="shidao">
                                    实到：{cls.shidao || 0}人
                                </p>
                                <p className="weidao">
                                    未到：{cls.students_num - cls.shidao || 0}人
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        {isLoading
                            ? <div className="scrollCard">
                                <BLoading type={"table"}/>
                              </div>
                            : <div className="scrollCard scrollCard-1">
                                {this.state.students.length === 0
                                ? <BNoData msg={this.state.msg}></BNoData>
                                :this.state.students.map(item => {
                                    return (
                                        <CardContainer
                                            key={item.id}
                                            src={item.photo ? `${item.photo}` : defaultImg}
                                            className={`card${
                                                item.attendance_status !== 1 ? ' warnings' : '' }`}
                                        >
                                            <div className="alt">
                                                <div className="info">
                                                    <span className="tit">
                                                        姓名
                                                    </span>
                                                    <span className="infoTit" title={item.subject_name}>
                                                        {item.subject_name}
                                                    </span>
                                                </div>
                                                <div className="info">
                                                    <span className="tit">
                                                        学号
                                                    </span>
                                                    <span className="infoTit" title={item.subject_job_number}>
                                                        {item.subject_job_number}
                                                    </span>
                                                </div>
                                                {item.attendance_status === 1 ? (
                                                    <div className="info pri">
                                                        <span className="tit pri">
                                                            到课
                                                        </span>
                                                        <span className="infoTit pri">
                                                            {
                                                                $_date
                                                                    .init(
                                                                        'YYYY-MM-DD HH:mm:ss',
                                                                        item.event_time *
                                                                            1000
                                                                    )
                                                                    .split(' ')[1]
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="info">
                                                        <span className="tit">
                                                            缺勤
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContainer>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ClassmateAttend
