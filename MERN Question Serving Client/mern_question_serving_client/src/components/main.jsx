import React, { Component, PropTypes } from 'react';
import TutorPanel from './tutor/tutor_panel'
import StudentPanel from './student/student_panel'
import Profile from './profile/profile'
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	user: undefined
        }
    }

    componentDidMount() {
    	this.getUser();
    }

    getUser = () => {
		axios.get('/api/users/').then(res => {
			this.setState({user: res.data})
		}).catch(err => {
            if(err.response.status == 401){
                window.location.replace("/login");
            }
        });
    }

    render() {
        return (
            <div>
	            <nav>
	            	<div className="nav-left">
						<Link to="/">Home</Link>
						<Link to="/app/tutor">Tutor</Link>
						<Link to="/app/student">Student</Link>
						<Link to="/app/profile">Profile</Link>
						<Link to="/login">Log In</Link>
	            	</div>
	            	<div className="nav-right">
	            		<img className="nav-profile-icon" src={this.state.user?.profileIcon}/>
	            	</div>
	            </nav>

				<Switch>
					<Route path="/app/tutor">
						<TutorPanel/>
					</Route>
					<Route path="/app/student">
						<StudentPanel/>
					</Route>
					<Route path="/app/profile">
						<Profile/>
					</Route>
				</Switch>
            </div>
        );
    }
}

export default Main;
