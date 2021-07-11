import React, { Component, PropTypes } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import ViewStudentPerformance from 'components/tutor/view_student_performance'
import Profile from './profile'
import Page404 from 'components/page_404'
import Footer from 'components/footer'
import Back from 'components/back'

class ProfileControler extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div className="profile-controller">
        		<div className="profile-controller-inner trad-cont">
		            <Switch>
		            	<Route path="/profile/:student_username/performance">
		            		<ViewStudentPerformance/>
		            	</Route>
		            	<Route path="/profile/:username">
		            		<Back className="top-left"/>
		            		<Profile current_username={this.props.current_username}/>
		            	</Route>
		            	{this.props.current_username ?
			            	<Route path="/profile/">
			            		<Redirect to={`/profile/${this.props.current_username}`}/>
			            	</Route>
		            	:
		            		<Page404/>
		            	}
		            </Switch>
        		</div>
	            <Footer/>
        	</div>
        );
    }
}

export default ProfileControler;
