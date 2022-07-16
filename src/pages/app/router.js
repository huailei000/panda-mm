import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

export default ({ match }) => {
    return (
        <Switch>
            <Route
                path={`${match.url}/home`}
                component={require('lazy|./home')}
            />
            <Route
                path={`${match.url}/teachinfo/classroom`}
                component={require('lazy|./teachinfo/classroom')}
            />
            <Route
                path={`${match.url}/teachinfo/courseNum`}
                component={require('lazy|./teachinfo/courseNum')}
            />
            <Route
                path={`${match.url}/teachinfo/term`}
                component={require('lazy|./teachinfo/term')}
            />
            <Route
                path={`${match.url}/teachinfo/teacher`}
                component={require('lazy|./teachinfo/teacher')}
            />
            <Route
                path={`${match.url}/teachinfo/student`}
                component={require('lazy|./teachinfo/student')}
            />
            <Route
                path={`${match.url}/teachinfo/lessonInfo`}
                component={require('lazy|./teachinfo/lessonInfo')}
            />
            <Route
                path={`${match.url}/teachinfo/classmateInfo`}
                component={require('lazy|./teachinfo/classmateInfo')}
            />
            <Route
                path={`${match.url}/sheetmanage`}
                component={require('lazy|./sheetmanage')}
            />
            <Route
                path={`${match.url}/screen`}
                component={require('lazy|./screen')}
            />
            <Route
                path={`${match.url}/historyRecord`}
                component={require('lazy|./historyRecord/recognitionHistory')}
            />
            <Route
                path={`${match.url}/attendAnalysis/personalAttend`}
                component={require('lazy|./attendAnalysis/personalAttend')}
            />
            <Route
                path={`${match.url}/attendAnalysis/classmateAttend`}
                component={require('lazy|./attendAnalysis/classmateAttend')}
            />
            <Route
                path={`${match.url}/behaviorAnalysis`}
                component={require('lazy|./behaviorAnalysis')}
            />
            <Route component={() => <Redirect push to="/panda/home" />} />
        </Switch>
    )
}
