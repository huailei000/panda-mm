import React from 'react'
import { withRouter } from 'react-router-dom'
import { XIcon } from 'xcomponents'

@withRouter
export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nowId: null
        }
    }

    initSidebarFn(data) {
        this.props.history.$push(`/panda${data.codeName}`)
        this.setState({
            nowId: data.id
        })
    }

    render() {
        const { data, location } = this.props
        let currentColor = ''
        if (data.children && data.children.length > 0) {
            data.children.forEach(element => {
                if (location.pathname.indexOf(element.codeName) > -1) {
                    currentColor = 'active'
                    return
                }
            })
        } else {
            currentColor =
                location.pathname.indexOf(data.codeName) > -1 ? 'active' : null
        }
        return (
            <li
                key={data.id}
                id={this.state.nowId}
                className={`menu-only ${currentColor}`}
                onClick={this.initSidebarFn.bind(this, data)}
            >
                <a>
                    {data.icon ? (
                        <XIcon
                            type={data.codeName.replace('/', '')}
                            className="icon-left"
                        />
                    ) : null}
                    <span className="name">{data.name}</span>
                    <i className="fa fa-angle-left pull-right" />
                </a>
            </li>
        )
    }
}
