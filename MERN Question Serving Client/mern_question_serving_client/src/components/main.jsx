import React, { Component, PropTypes } from 'react';
import TutorPanel from './tutor/tutor_panel'
import StudentPanel from './student/student_panel'
import Profile from './profile/profile'
import axios from 'axios';
import SetController from './student/set_controller'
import ProfileController from './profile/profile_controller'
import Setup from './auth/setup'
import Footer from './footer'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
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

    componentDidUpdate(){
    	try{
			document.documentElement.style.setProperty('--nav-height', document.getElementsByTagName('nav')[0].offsetHeight + 'px');
    	}catch(err){
    		console.log(err);
    	}
    }

    getUser = () => {
		axios.get('/api/users/').then(res => {
			this.setState({user: res.data})
			if(!res.data.username | !res.data.displayName | !(res.data.tutor | res.data.student)){
                window.location.replace("/app/setup");
			}
		}).catch(err => {
            if(err.response.status == 401){
                window.location.replace("/login");
            }
        });
    }

    render() {
    	if(this.state.user){
	        return (
	            <div>
		            <nav>
		            	<div className="nav-left">
							<Link to="/">Home</Link>
							{this.state.user.tutor && <Link to="/app/tutor">Tutor</Link>}
							{this.state.user.student && <Link to="/app/student">Student</Link>}
							<a href="/auth/logout">Log Out</a>
		            	</div>
		            	<div className="nav-right">
		            		<Link to={`/profile/${this.state.user.username}`}><img className="nav-profile-icon" src={this.state.user?.profileIcon}/></Link>
		            	</div>
		            </nav>
		            <div className="main-inner">	            	
						<Switch>
							<Route path="/app/tutor">
								<TutorPanel/>
							</Route>
							<Route path="/app/student/:set_id">
								<SetController/>
							</Route>
							<Route path="/app/student">
								<StudentPanel/>
							</Route>
							<Route path="/app/setup">
								<Setup user={this.state.user}/>
							</Route>
							<Route path="/app/">
								<Redirect to={`/app/${this.state.user.tutor ? 'tutor' : (this.state.user.student ? 'student' : 'setup')}`}/>
							</Route>
						</Switch>
		            </div>
					<Footer/>
	            </div>
	        );
    	}else{
    		return (
    			<em>Give us a second</em>
    		)
    	}
    }
}

export default Main;
