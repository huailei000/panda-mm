import { $_ajax, $_date } from 'services'

const url = {
    newCourse: 'info/course', // 新建课程
    deleteCourse: 'info/course', // 删除课程
    putCourse: 'info/course' // 更新课节信息
}

const api = {
    newCourse: params => $_ajax.post(url.newCourse, params),
    deleteCourse: id => $_ajax.delete(`${url.deleteCourse}/${id}`),
    putCourse: (params, id) => $_ajax.put(`${url.putCourse}/${id}`, params)
}
export default api
