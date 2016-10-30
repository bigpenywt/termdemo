import React from 'react';

import ToBeReviewTerm from './ToBeReviewTerm.jsx';

export default class ToBeReviewByAll extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <ToBeReviewTerm author="all"/>
    }
}
