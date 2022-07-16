import React, { Component, Fragment } from 'react';
import { XInput, XButton, XModal, XTimePicker, XSelector } from 'xcomponents';
import { $_ajax, $_date, $_toast } from 'services';

export default class extends Component {
    constructor(props) {
        super(props);
        let teacherOpt = this.formatList(props.data.teacherList);
        let courseOpt = this.formatList(props.data.courseList);
        let clsOpt = this.formatList(props.data.gradeList);
        let classroomOpt = this.formatList(props.data.roomList);
        let lessonOpt = this.formatList(props.data.lessonList);
        this.state = {
            id: props.data.id,
            create_time: props.data.create_time
                ? $_date.init('YYYY-MM-DD', new Date(props.data.create_time * 1000))
                : $_date.init('YYYY-MM-DD', new Date()),
            teacherOpt: teacherOpt,
            courseOpt: courseOpt,
            clsOpt: clsOpt,
            classroomOpt: classroomOpt,
            weekday: props.data.weekday,
            lesson_index_id: props.data.lesson_id ? props.data.lesson_id : lessonOpt[0].value,
            teacher_id: props.data.teacher_id ? props.data.teacher_id : (props.data.curIndex === 1 ? teacherOpt[props.data.teacherIndex].value : teacherOpt[0].value),
            course_id: props.data.course_id ? props.data.course_id : courseOpt[0].value,
            cls_id: props.data.cls_id ? props.data.cls_id : (props.data.curIndex === 0 ? clsOpt[props.data.gradeIndex].value : clsOpt[0].value),
            classroom_id: props.data.classroom_id ? props.data.classroom_id : (props.data.curIndex === 2 ? classroomOpt[props.data.roomIndex].value : classroomOpt[0].value),

            curIndex: props.data.curIndex,
            gradeIndex: props.data.gradeIndex,
            roomIndex: props.data.roomIndex,
            teacherIndex: props.data.teacherIndex
        };
    }

    formatList(list) {
        let newList = [];
        newList = list.map(item => {
            item.label = item.name;
            item.value = item.id;
            return item;
        });
        return newList;
    }

    confirmFn() {
        const { confirm, data } = this.props;
        let param = {
            teacher_id: this.state.teacher_id,
            course_id: this.state.course_id,
            cls_id: this.state.cls_id,
            classroom_id: this.state.classroom_id,
            weekday: this.state.weekday,
            lesson_index_id: this.state.lesson_index_id
        };
        if (data.type === 'create') {
            $_ajax.post('info/lessontable', param).then(
                res => {
                    confirm();
                    $_toast('新增成功！');
                },
                res => {
                    $_toast(res.desc);
                }
            );
        } else {
            $_ajax.put(`info/lessontable/${this.state.id}`, param).then(
                res => {
                    confirm();
                    $_toast('编辑成功！');
                },
                res => {
                    $_toast(res.desc);
                }
            );
        }
    }

    render() {
        const { confirm, cancel, data } = this.props;
        return (
            <div className="sheetmanage-edit">
                <XModal.Header {...this.props}>{data.type === 'create' ? '新增' : '编辑'}课表详情</XModal.Header>
                <XModal.Body>
                    <div className="edit-basic">
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>课程名称
                            </div>
                            <div className="value">
                                <XSelector
                                    options={this.state.courseOpt}
                                    placeholder="请选择课程名称"
                                    defaultValue={this.state.course_id}
                                    onChange={res => {
                                        this.setState({
                                            course_id: res.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>任课教师
                            </div>
                            <div className="value">
                                {this.state.curIndex === 1 ?
                                    <span>{this.props.data.teacherList[this.state.teacherIndex].name}</span>
                                    :
                                    <XSelector
                                        options={this.state.teacherOpt}
                                        placeholder="请选择任课教师"
                                        defaultValue={this.state.teacher_id}
                                        onChange={res => {
                                            this.setState({
                                                teacher_id: res.value
                                            });
                                        }}
                                    />
                            }
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>上课班级
                            </div>
                            <div className="value">
                                {this.state.curIndex === 0 ?
                                    <span>{this.props.data.gradeList[this.state.gradeIndex].name}</span>
                                    :
                                    <XSelector
                                        options={this.state.clsOpt}
                                        placeholder="请选择上课班级"
                                        defaultValue={this.state.cls_id}
                                        onChange={res => {
                                            this.setState({
                                                cls_id: res.value
                                            });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">
                                <span className="required">*</span>上课教室
                            </div>
                            <div className="value">
                                {this.state.curIndex === 2 ?
                                    <span>{this.props.data.roomList[this.state.roomIndex].name}</span>
                                    :
                                    <XSelector
                                        options={this.state.classroomOpt}
                                        placeholder="请选择上课教室"
                                        defaultValue={this.state.classroom_id}
                                        onChange={res => {
                                            this.setState({
                                                classroom_id: res.value
                                            });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        <div className="form-item">
                            <div className="name">创建时间</div>
                            <div className="value">{this.state.create_time}</div>
                        </div>
                    </div>
                </XModal.Body>
                <XModal.Footer>
                    <XButton type={'primary'} onClick={::this.confirmFn}>
                        确认
                    </XButton>
                    <XButton
                        onClick={() => {
                            cancel();
                        }}
                    >
                        关闭
                    </XButton>
                </XModal.Footer>
            </div>
        );
    }
}
