import { $_ajax, $_date } from 'services'

const url = {
    getClasses: 'classes', // 获取班级列表,
    getLessonindex: 'info/lessonindexs', // 获取课节列表,
    getCourse: 'attendance/class', // 获取单课程考勤
    getLessontables: 'info/lessontables' // 课表管理
}

const api = {
    getClasses: params => $_ajax.get(url.getClasses, params),
    getLessonindex: params => $_ajax.get(url.getLessonindex, params),
    getCourse: params => $_ajax.getMock(url.getCourse, params),
    getLessontables: params => $_ajax.getMock(url.getLessontables, params)
}
export default api
