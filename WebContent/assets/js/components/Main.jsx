import React from 'react';
import {Router, Route, IndexRoute, createMemoryHistory} from 'react-router';
const history = createMemoryHistory(location);

import {pathConfig} from '../pathConfig.js';

import ActionLayout from './ActionLayout.jsx';
import ModifyUserInfo from './ModifyUserInfo.jsx';
import CreatTerm from './CreatTerm.jsx';
import BeRejectTerm from './BeRejectTerm.jsx';
import HasRejectedTerm from './HasRejectedTerm.jsx';
import ToBePublishTerm from './ToBePublishTerm.jsx';
import HasPublishedTerm from './HasPublishedTerm.jsx';
import ToBeReviewByAll from './ToBeReviewByAll.jsx';
import ToBeReviewByMe from './ToBeReviewByMe.jsx';
import DeletedTerm from './DeletedTerm.jsx';
import Magazine from './Magazine.jsx'
import UserInfo from './UserInfo.jsx';
import SearchConfig from './SearchConfig.jsx';
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
                <Route path="/" userName={this.props.userName} userRole={this.props.userRole} component={ActionLayout}>
                    <IndexRoute component={Welcome}/>
                    <Route path="/modifyUserInfo" component={ModifyUserInfo}/>
                    <Route path="/creat" component={CreatTerm}/>
                    <Route path="/toBeReviewByMe" component={ToBeReviewByMe}/>
                    <Route path="/beReject" component={BeRejectTerm}/>
                    <Route path="/toBeReviewByAll" component={ToBeReviewByAll}/>
                    <Route path="/hasRejectedWhenCalibrate" stage="calibrate" component={HasRejectedTerm}/>
                    <Route path="/toBePublish" component={ToBePublishTerm}/>
                    <Route path="/hasRejectedWhenPublish" stage="publish" component={HasRejectedTerm}/>
                    <Route path="/hasPublished" component={HasPublishedTerm}/>
                    <Route path="/deleted" component={DeletedTerm}/>
                    <Route path="/magazine" component={Magazine}/>
                    <Route path="/user" component={UserInfo}/>
                    <Route path="/searchConfig" component={SearchConfig}/>
                    <Route path="/log" component={Log}/>
                </Route>
            </Router>
        )
    }
}

Main.propTypes = {
    userName: React.PropTypes.string.isRequired,
    userRole: React.PropTypes.string.isRequired
};
