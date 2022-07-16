import { $_ajax, $_date } from 'services'

const url = {
    newClass: 'info/lessonindex', // 新建课节信息
    deleteClass: 'info/lessonindex', // 删除课节信息
    putClass: 'info/lessonindex', // 更新课节信息
    terms: 'info/terms' // 获取学期列表
}

const api = {
    newClass: params => $_ajax.post(url.newClass, params),
    deleteClass: id => $_ajax.delete(`${url.deleteClass}/${id}`),
    putClass: (params, id) => $_ajax.put(`${url.putClass}/${id}`, params),
    terms: () => $_ajax.get(url.terms)
}

export default api
