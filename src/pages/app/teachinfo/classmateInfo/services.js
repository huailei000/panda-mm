import { $_ajax, $_date } from 'services'

const url = {
    students: 'students', // 获取学生列表,
    newClass: 'class', // 新建班级信息
    editClass: 'class', // 新建班级信息
    deleteClasses: 'class',
    searchStedent: 'subject/get', // 搜索学生
    getTeachers: 'teachers', // 教师列表
}

const api = {
    students: params => $_ajax.get(url.students, params),
    getTeachers: params => $_ajax.get(url.getTeachers, params),
    newClass: params => $_ajax.post(url.newClass, params),
    editClass: (id, params) => $_ajax.put(`${url.editClass}/${id}`, params),
    deleteClasses: id => $_ajax.delete(`${url.deleteClasses}/${id}`),
    searchStedent: params => $_ajax.get(url.searchStedent, params)
}
export default api
