/**
 * Created by Rayr Lee on 2018/6/11.
 */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import axios from 'axios';
import { Router } from 'react-router';
import { $_toast, $_ajax, $_conf, $_cookie } from 'services';

import History from './history';
import Pages from './pages';
import stores from 'stores';
import { BLoading } from 'bcomponents';

window.KAOLA_PANDA_GLOBAL_STORES = stores;

export default class extends Component {
    constructor() {
        super();
        this.state = {
            isAuth: false
        };
    }

    // getUserInfo
    getUserInfo() {
        $_ajax.getMock('user', {
            detail: true
        }).then(
                res => {
                    KAOLA_PANDA_GLOBAL_STORES.UserStore.initUser(res.data);
                },
                res => {
                    // 获取用户信息失败，跳转到根目录页面
                    $_toast(res.desc);
                    window.location.href = $_conf.login;
                }
            )
            .finally(() => {
                this.setState({
                    isAuth: true
                });
            });
    }

    // 测试
    testLogin() {
        let _this = this;
        axios.post(`${$_conf.auth}`, {
                username: $_conf.username,
                password: $_conf.password
            })
            .then(({ data }) => {
                $_cookie.set('access_token', data.data['access_token']);
                axios.defaults.headers.common['Authorization'] = data.data['access_token'];
            })
            .then(() => {
                _this.getUserInfo();
            });
    }

    componentWillMount() {
        this.testLogin();
        // this.getUserInfo();
    }

    render() {
        const { isAuth } = this.state;
        return isAuth ? (
            <Provider {...stores}>
                <Router history={History}>
                    <Pages />
                </Router>
            </Provider>
        ) : (
            <BLoading type={'page'} />
        );
    }
}
