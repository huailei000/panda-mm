import React, { Component, Fragment } from 'react';
import { BSheet } from 'bcomponents';
import AttendCard from '../attendCard';
import { $_date, $_toast, $_ajax } from 'services'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: props.classArr,
            courseObj2: {
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
            },
            courseConf: [
                { num: '第一节', time: '8:00-8:40' },
                { num: '第二节', time: '8:00-8:40' },
                { num: '第三节', time: '8:00-8:40' },
                { num: '第四节', time: '8:00-8:40' },
                { num: '第五节', time: '8:00-8:40' },
                { num: '第六节', time: '8:00-8:40' },
                { num: '第七节', time: '8:00-8:40' },
                { num: '第八节', time: '8:00-8:40' },
                { num: '第九节', time: '8:00-8:40' },
                { num: '第十节', time: '8:00-8:40' },
                { num: '第十一节', time: '8:00-8:40' },
                { num: '第十二节', time: '8:00-8:40' }
            ],
        }
    }
    /**
     * 补零
     */
    fliterTime(num) {
        const n = Number(num)
        return n < 10 ? `0${n}` : n
    }
    componentDidMount() {
        this.test();
        this.getLessons();
    };
    test() {
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
        this.state.className.forEach((item, index) => {
            const date = new Date(item.date);
            let week = date.getDay() - 1;
            week = week < 0 ? 6 : week;
            index < 12 && item.list.forEach((element, i) => {
                if (element.lesson_index.num === 0) return;
                courseObj[`course${element.lesson_index.num - 1}`][week] = {
                    name: element.attendance.course_name,
                    teacher: element.teacher.name,
                    site: $_date.init('HH:mm', element.attendance.event_time * 1000),
                    isDealy: element.attendance.attendance_status == 0 ?  true: false
                }
                this.setState({
                    courseObj2: courseObj
                })
            });
        })
    }
    weekConf = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    // 获取课节时间
    getLessons() {
        let courseConf = [
            { num: '第一节', time: '8:00-8:40' },
            { num: '第二节', time: '8:00-8:40' },
            { num: '第三节', time: '8:00-8:40' },
            { num: '第四节', time: '8:00-8:40' },
            { num: '第五节', time: '8:00-8:40' },
            { num: '第六节', time: '8:00-8:40' },
            { num: '第七节', time: '8:00-8:40' },
            { num: '第八节', time: '8:00-8:40' },
            { num: '第九节', time: '8:00-8:40' },
            { num: '第十节', time: '8:00-8:40' },
            { num: '第十一节', time: '8:00-8:40' },
            { num: '第十二节', time: '8:00-8:40' }
        ]
        $_ajax.get('info/lessonindexs').then(
            res => {
                res.data &&
                    res.data.list.sort((a, b) => {
                        if (a.num > b.num) {
                            return 1
                        } else {
                            return -1
                        }
                    }) &&
                    res.data.list.forEach((item, index) => {
                        courseConf[index].time = `${this.fliterTime(item.start_hour)}:${
                            this.fliterTime(item.start_min)
                            }~${this.fliterTime(item.end_hour)}:${
                            this.fliterTime(item.end_min)
                            }`
                    })
                    
                this.setState({
                    courseConf: courseConf.splice(0, res.data.list.length)
                }, () => {
                    // console.log(this.courseConf);
                })
            },
            res => {
                $_toast(res.desc)
            }
        )
    }

    render() {
        return (
            <div className="personal-attend-month">
                <BSheet>
                    <BSheet.Row>
                        <BSheet.Empty />
                        {
                            this.weekConf.map((item, index) => {
                                return <BSheet.Week val={item} key={`week${index}`} />;
                            })
                        }
                    </BSheet.Row>
                    {
                        this.state.courseConf.map((item, index) => {
                            return (
                                <Fragment key={`row${index}`}>
                                    <BSheet.Row>
                                        <BSheet.Course val={item.num} time={item.time} key={`course${index}`} />
                                        {
                                            this.state.courseObj2[`course${index}`].map((child, i) => {
                                                return (
                                                    JSON.stringify(child) !=='{}' ?
                                                        (
                                                            <BSheet.Normal
                                                                val={child.name}
                                                                type={child.isDealy == true ? 'red' : ''}
                                                                site={child.isDealy == 0 ? child.site : child.teacher}
                                                                key={`normal${i}`} />
                                                        )
                                                        : <BSheet.Void
                                                            key={`void${index}${i}`}
                                                            title="暂无记录"
                                                            type="not"
                                                            state={this.state.isEditing}
                                                        />
                                                )
                                            })
                                        }
                                    </BSheet.Row>
                                    {
                                        (index === 3 || index === 7) ?
                                            <BSheet.Line key={`line${index}`} /> : null
                                    }
                                </Fragment>
                            )
                        })
                    }
                </BSheet>
            </div>
        );
    }
}
