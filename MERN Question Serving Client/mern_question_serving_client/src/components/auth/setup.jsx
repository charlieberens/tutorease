import React, { Component, PropTypes } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import StudentTutorSelect from './student_tutor_select';
import Username from './username';
import DisplayName from './display_name';
import Bio from './bio';

class Setup extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
        	<div>
	            <Switch>
	            	<Route path="/app/setup/student-tutor-select">
	            		<div>eeee</div>
	            		<StudentTutorSelect user={this.props.user}/>
	            	</Route>
	            	<Route path="/app/setup/username">
	            		<Username user={this.props.user}/>
	            	</Route>
	            	<Route path="/app/setup/display-name">
	            		<DisplayName user={this.props.user}/>
	            	</Route>
	            	<Route path="/app/setup/bio">
	            		<Bio user={this.props.user}/>
	            	</Route>
	            	{/* <Route path="/app/setup/bio"> */}
	            	{/* 	<Bio user={this.props.user}/> */}
	            	{/* </Route> */}
	            	<Route path="/app/setup/">
	            		<Redirect to="/app/setup/student-tutor-select"/>
	            	</Route>
	            </Switch>
        	</div>
        );
    }
}

export default Setup;
