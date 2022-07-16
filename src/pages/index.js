import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

export default class extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/panda'} component={require('./app')} />
                <Route component={() => <Redirect push to="/panda" />} />
            </Switch>
        )
    }
}
