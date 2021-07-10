import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class StudentSets extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	todo: [],
        	completed: []
        }
    }

    componentDidMount = () => {
    	this.loadSets();
    }

    loadSets = async () => {
        axios('/api/students/sets').then(res => {
        	this.setState({
        		todo: res.data.incomplete.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate)),
        		completed: res.data.complete.sort((a, b) => new Date(a.completeDate) - new Date(b.completeDate))
        	})
        }).catch(err => {
            console.log(err)
        });
    }

    render() {
    	console.log(this.state)
        return (
            <div>
                {!!this.state.todo?.length &&
                    <div className="student-set-list-section">
                    	<h3>To-do</h3>
                    	{this.state.todo?.map((set, index) => 
                            <Link className="student-set-list-item" to={`/app/student/set/${set.setId}`}>
                                <div className="student-set-list-item-left">
                                   	<h2 className="student-set-list-set-title">{set.title}</h2>
                                    <span className="student-set-list-set-tutor"><img className="student-set-list-set-tutor-icon" src={`${set.tutorProfileIcon}`}/> {set.tutorDisplayName}</span>
                                </div>
                                <div className="student-set-list-item-right">
                                    <h3>
                                        {set.numAnswered ?
                                            `${set.numAnswered} of ${set.setLength}`
                                            :
                                            `${set.setLength} question${set.setLength > 1 ? 's' : ''}`
                                        }
                                    </h3>
                                </div>
                            </Link>
                    	)}
                    </div>
                }
                {!!this.state.completed?.length &&
                    <div className="student-set-list-section">
                    	<h3>Completed</h3>
                    	{this.state.completed?.map((set, index) => 
                            <Link className="student-set-list-item" to={`/app/student/set/${set.setId}`}>  
                                <div className="student-set-list-item-left">
                                    <h2 className="student-set-list-set-title">{set.title}</h2>
                                    <span className="student-set-list-set-tutor"><img className="student-set-list-set-tutor-icon" src={`${set.tutorProfileIcon}`}/> {set.tutorDisplayName}</span>
                                </div>
                                <div className="student-set-list-item-right">
                                    <h3>{`${set.numCorrect} of ${set.setLength}`}</h3>
                                </div>
                            </Link>

                    	)}
                    </div>
                }
            </div>
        );
    }
}

export default StudentSets;
