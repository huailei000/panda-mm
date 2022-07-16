import './index.scss'
import React from 'react'
import MenuTree from './menu_tree'
import MenuOnly from './menu_only'
import { withRouter } from 'react-router-dom'
import { $_map } from 'services'

@withRouter
export default class extends React.Component {
    constructor() {
        super()
        this.state = {
            height: innerHeight - 100
        }
    }

    componentDidMount() {
        let _this = this
        window.addEventListener(
            'resize',
            () => {
                _this.setState({
                    height: window.innerHeight - 100
                })
            },
            false
        )
    }

    render() {
        return (
            <aside
                className="xcomponent-sidebar"
                style={{ height: `${this.state.height}px` }}
            >
                <ul className="siderbar-menu">
                    {$_map.menuList &&
                        $_map.menuList.map(item => {
                            return item.children.length === 0 ? (
                                <MenuOnly data={item} key={item.id} />
                            ) : (
                                <MenuTree data={item} key={item.id} />
                            )
                        })}
                </ul>
            </aside>
        )
    }
}
