import React from 'react'
import { withRouter } from 'react-router-dom'
import MenuItem from './menu_item'
import { XIcon } from 'xcomponents'

@withRouter
export default class extends React.Component {
    constructor(props) {
        super()
        this.state = {
            isToggle:
                location.pathname.indexOf(props.data.codeName) > -1
                    ? true
                    : false
        }
    }

    render() {
        const { location, data, onClick, nowId, match } = this.props
        const { isToggle } = this.state
        let _h = data.children.length * 52
        let currentColor =
            location.pathname.indexOf(data.codeName) > -1 ? 'active' : null

        return (
            <li
                className={`treeview ${this.state.isToggle ? 'menu-open' : ''}`}
            >
                <a
                    className={`tree-header`}
                    onClick={() => {
                        this.setState({ isToggle: !isToggle })
                    }}
                >
                    {data.icon ? (
                        <XIcon
                            type={data.codeName.replace('/', '')}
                            className="icon-left"
                        />
                    ) : null}
                    <span className={`${currentColor}`}> {data.name}</span>
                    {data.icon ? (
                        <XIcon
                            type="angle-up"
                            className="up-icon dropdown-menu-icon"
                        />
                    ) : null}
                    <i
                        className={`fa ${
                            this.state.isToggle
                                ? 'fa-angle-up'
                                : 'fa-angle-down'
                        } pull-right`}
                    />
                </a>
                <ul
                    className="treeview-menu"
                    style={{ height: `${this.state.isToggle ? _h : 0}px` }}
                >
                    {data.children.map((item, index) => {
                        return (
                            <MenuItem
                                key={item.id}
                                parent={data}
                                data={item}
                                icon={'circle-o'}
                            />
                        )
                    })}
                </ul>
            </li>
        )
    }
}
