import {
  $_ajax,
  $_date
} from 'services';

const url = {
  getLine: 'be/event/line', // 获取折现数据
  getEmotion: 'be/events', // 行为表情数据
  getClasses: 'classes', // 获取班级列表,
  getLessonindex: 'info/lessonindexs', // 获取课节列表,
  getCourse: 'attendance/class', // 获取单课程考勤
  getLessontables: 'info/lessontables' // 课表管理
}

const api = {
  getLine: (params) => $_ajax.getMock(url.getLine, params),
  getEmotion: (params) => $_ajax.getMock(url.getEmotion, params),
  getClasses: params => $_ajax.get(url.getClasses, params),
  getLessonindex: params => $_ajax.get(url.getLessonindex, params),
  getCourse: params => $_ajax.get(url.getCourse, params),
  getLessontables: params => $_ajax.get(url.getLessontables, params)
}
export default api;
