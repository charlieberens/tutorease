import React, { Component, PropTypes } from 'react';
import '../../styles/StudentPanel.css'
import TutorList from './tutor_list';
import StudentSets from './student_sets';

class StudentPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="student-panel">
            	<TutorList/>
                <div className="student-panel-sets-cont">
                    <StudentSets/>
                </div>
            </div>
        );
    }
}

export default StudentPanel;
