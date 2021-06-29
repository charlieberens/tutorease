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
        		todo: res.data.incomplete,
        		completed: res.data.complete
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
            		  <p>{set.title}</p>
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
