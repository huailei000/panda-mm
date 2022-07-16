import { $_ajax } from 'services'

const url = {
    events: 'event/events' // 获取学生列表,
}

const api = {
    getEvents: params => $_ajax.get(url.events, params)
}
export default api
