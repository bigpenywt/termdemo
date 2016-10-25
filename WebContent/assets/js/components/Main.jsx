import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import {pathConfig} from '../pathConfig.js';

import ActionLayout from './ActionLayout.jsx';
import CreatTerm from './CreatTerm.jsx';
import ReviewTerm from './ReviewTerm.jsx';
import PublishTerm from './PublishTerm.jsx';
import SafeguardHouse from './SafeguardHouse.jsx';
import ReeditRejected from './ReeditRejected.jsx';

import '../../../public/css/page/app/main.css'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={pathConfig.rootPath} component={ActionLayout}>
                    <IndexRoute component={CreatTerm}/>
                    <Route path="/CreatTerm" component={CreatTerm}/>
                    <Route path="/ReviewTerm" component={ReviewTerm}/>
                    <Route path="/PublishTerm" component={PublishTerm}/>
                    <Route path="/SafeguardHouse" component={SafeguardHouse}/>
                    <Route path="/ReeditRejected" component={ReeditRejected}/>
                </Route>
            </Router>
        )
    }
}

Main.propTypes = {
    userRole: React.PropTypes.string.isRequired
};
