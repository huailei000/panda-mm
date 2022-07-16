/*
 * ajax异步请求方法
 * */
import axios from 'axios'
import $_url from './url'
import $_util from './util'
import $_conf from './conf'

axios.defaults.headers.common['Authorization'] = $_util.getCookie(
    'access_token'
)

export default {
    commonFn(url, params = {}, type) {
        return new Promise((resolve, reject) => {
            axios[type](`${$_conf.preLoadAddr}${url}`, params, type)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data.code === 0) {
                            type === 'post'
                                ? resolve(res.data.data)
                                : resolve(res.data)
                        } else {
                            reject(res.data)
                        }
                    } else {
                        console.warn(res.status)
                        reject(res.status)
                        window.location.href = $_conf.login
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    // Mock-假数据专用
    commonFnMock(url, params = {}, type) {
        return new Promise((resolve, reject) => {
            axios[type](`${url}`, params, type)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data.code === 0) {
                            type === 'post'
                                ? resolve(res.data.data)
                                : resolve(res.data)
                        } else {
                            reject(res.data)
                        }
                    } else {
                        console.warn(res.status)
                        reject(res.status)
                        window.location.href = $_conf.login
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    post(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, $_url.initDel(params), 'post')
    },
    postFormData(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, params, 'post')
    },
    get(url, params = {}) {
        return this.commonFn(
            `/api/v1/${url}`,
            { params: $_url.initDel(params) },
            'get'
        )
    },
    put(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, $_url.initDel(params), 'put')
    },
    putFormData(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, params, 'put')
    },
    delete(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, { data: params }, 'delete')
    },
    // Mock--假数据专用-getMock
    getMock(url, params = {}) {
        return this.commonFnMock(
            `/api/v1/${url}`,
            { params: $_url.initDel(params) },
            'get'
        )
    },
    postMock(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, $_url.initDel(params), 'post')
    },
    putMock(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, $_url.initDel(params), 'put')
    },
    deleteMock(url, params = {}) {
        return this.commonFn(`/api/v1/${url}`, { data: params }, 'delete')
    },
}
