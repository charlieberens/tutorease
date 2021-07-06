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
                <div className="student-panel-sets-cont student-panel-left">
                    <h2>Sets</h2>
                    <StudentSets/>
                </div>
                <div className="student-panel-tutors-cont student-panel-right">
            	    <h2>Tutors</h2>
                    <TutorList/>
                </div>
            </div>
        );
    }
}

export default StudentPanel;
