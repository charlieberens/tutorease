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
            	<h2>To-do</h2>
            	{this.state.todo?.map((set, index) => 
                    <Link className="student-set-list-item" to={`/app/student/set/${set.setId}`}>  
                		<div className="student-set-list-item-right">                        
                            <h4 className="student-set-list-set-title">{set.title}</h4>
                            <span>Assigned by <Link to={`/profile/${set.tutorUsername}`}><img src={`${set.tutorProfileIcon}`}/> {set.tutorDisplayName}</Link></span>
                        </div>
                    </Link>
            	)}
            	<h2>Completed</h2>
            	{this.state.completed?.map((set, index) => 
                    <Link className="student-set-list-item" to={`/app/student/set/${set.setId}`}>  
                      <p>{set.title}</p>
                    </Link>
            	)}
            </div>
        );
    }
}

export default StudentSets;
