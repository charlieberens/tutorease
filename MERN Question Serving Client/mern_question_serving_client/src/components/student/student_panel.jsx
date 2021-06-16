import React, { Component, PropTypes } from 'react';
import '../../styles/StudentPanel.css'
import TutorList from './tutor_list';

class StudentPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="student-panel">
            	<TutorList/>
            </div>
        );
    }
}

export default StudentPanel;
