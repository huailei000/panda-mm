import React, { Component } from 'react'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { $_map } from 'services'
import { XHeader, XSidebar, XFooter, XTab } from 'xcomponents'
import { ToastContainer } from 'react-toastify'

import AppRouter from './router'

const behaviorAnalysis = {
    id: 70,
    name: '行为统计分析',
    codeName: '/behaviorAnalysis',
    children: [],
} // 考勤 1  考勤+巡航 2

@withRouter
@inject('UserStore')
@observer
export default class extends Component {
    constructor(props) {
        super(props)
        // 巡航+考勤的时候显示考勤分析
        if (props.UserStore.user.company.deployment * 1 === 2) {
            $_map.menuList.splice(4, 0, behaviorAnalysis);
        }
    }
    changeTitle() {
        let { UserStore } = this.props
        Object.getOwnPropertyNames($_map.PandaMenuMap).forEach(function(key) {
            if (location.pathname === '/panda' + $_map.PandaMenuMap[key]) {
                UserStore.curTitle = key
                return
            }
        })
    }

    componentDidUpdate() {
        window.scrollTo(0, 0)
        this.changeTitle()
    }

    componentDidMount() {
        this.changeTitle()
    }

    render() {
        return [
            <section className="panda-sidebar" key="Sidebar">
                <section className="panda-logo">
                    <span />
                </section>
                <XSidebar />
            </section>,
            <section className="panda-body" key="Body">
                <section className="panda-header">
                    <XHeader />
                </section>
                <section className="panda-content">
                    <AppRouter {...this.props} />
                </section>
            </section>,
            <ToastContainer
                key={'Toast'}
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeButton={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
                className="toast-container"
                toastClassName="toast-reset"
                bodyClassName="toast-reset-body"
            />
        ]
    }
}
