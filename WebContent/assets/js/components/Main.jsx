import React from 'react';
import {Router, Route, IndexRoute, createMemoryHistory} from 'react-router';
const history = createMemoryHistory(location);

import {pathConfig} from '../pathConfig.js';

import ActionLayout from './ActionLayout.jsx';
import CreatTerm from './CreatTerm.jsx';
import ToBeReviewTerm from './ToBeReviewTerm.jsx';
import BeRejectTerm from './BeRejectTerm.jsx';
import HasRejectedTerm from './HasRejectedTerm.jsx';
import ToBePublishTerm from './ToBePublishTerm.jsx';
import HasPublishedTerm from './HasPublishedTerm.jsx';
import UserInfo from './UserInfo.jsx';
import Log from './Log.jsx';
import Welcome from './Welcome.jsx';

import '../../../public/css/page/app/main.css'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Router history={history}>
                <Route path="/" component={ActionLayout}>
                    <IndexRoute component={Welcome}/>
                    <Route path="/creat" component={CreatTerm}/>
                    <Route path="/toBeReviewByMe" author="me" component={ToBeReviewTerm}/>
                    <Route path="/beReject" component={BeRejectTerm}/>
                    <Route path="/toBeReviewByAll" author="all" component={ToBeReviewTerm}/>
                    <Route path="/hasRejectedWhenCalibrate" stage="calibrate" component={HasRejectedTerm}/>
                    <Route path="/toBePublish" component={ToBePublishTerm}/>
                    <Route path="/hasRejectedWhenPublish" stage="publish" component={HasRejectedTerm}/>
                    <Route path="/hasPublished" component={HasPublishedTerm}/>
                    <Route path="/user" component={UserInfo}/>
                    <Route path="/log" component={Log}/>
                </Route>
            </Router>
        )
    }
}

Main.propTypes = {
    userRole: React.PropTypes.string.isRequired
};
