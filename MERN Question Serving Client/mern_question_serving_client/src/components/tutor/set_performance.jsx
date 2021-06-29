import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';

class SetPerformance extends Component {
    constructor(props) {
        super(props);
    }

    completeSort = (student_a, student_b) => {
        return ((student_a.numAnswered === this.props.set.questions.length) && student_b.numAnswered === student_a.numAnswered )? 0 : (student_a.numAnswered == this.props.set.questions.length)? -1 : 1;
    }

    render() {
    	console.log(this.props.set, this.props.students[0])
        return (
			<div>
				<div className="set-performance-student-list">
					{this.props.students.sort(this.completeSort).map((student,index) => 
						<div className={`set-performance-student ${student.numAnswered != this.props.set.questions.length && 'incomplete'}`}>
							<div className="set-performance-student-left">
								<img className="set-performance-student-left-left" src={student.profileIcon}/>
								<div className="set-performance-student-left-right">
									<h3>{student.displayName}</h3>
									<span>@{student.username}</span>
								</div>
							</div>
							<div className="set-performance-student-bar"></div>
							{student.numAnswered === this.props.set.questions.length ? 
								<div className="set-performance-student-right completed">
									<div className="set-performance-student-right-top">
										<span>{student.numCorrect}</span> out of <span>{this.props.set.questions.length}</span>
									</div>
									<div className="set-performance-student-right-bottom">
										<Link className="grey-a" to={`${this.props.base_path}/${student.id}`}>Details</Link>
									</div>
								</div>
								:
								<div className="set-performance-student-right">Not Completed</div>
							}
						</div>
					)}
				</div>
			</div>            
        );
    }
}

export default SetPerformance;
