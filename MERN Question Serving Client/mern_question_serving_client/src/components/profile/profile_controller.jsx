import React, { Component, PropTypes } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ViewStudentPerformance from '../tutor/view_student_performance'
import Profile from './profile'

class ProfileControler extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div>
	            <Switch>
	            	<Route path="/app/profile/:student_username/performance">
	            		<ViewStudentPerformance/>
	            	</Route>
	            	<Route path="/app/profile/:username">
	            		<Profile current_user={this.props.current_user}/>
	            	</Route>
	            	<Route path="/app/profile/">
	            		<Redirect to={`/app/profile/${this.props.current_user.username}`}/>
	            	</Route>
	            </Switch>
        	</div>
        );
    }
}

export default ProfileControler;
