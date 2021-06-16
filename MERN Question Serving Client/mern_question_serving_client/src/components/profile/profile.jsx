import React, { Component, PropTypes } from 'react';
import axios from 'axios';

import '../../styles/Profile.css'

import {
	Redirect
} from "react-router-dom";

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roleSetup: true,
			nameSetup: true
		}
	}

    componentDidMount() {
    	this.checkSetup();
    }

	checkSetup = () => {
		axios.get('/api/users/').then(res => {
			console.log(res.data);
			this.setState({
				roleSetup: (res.data.student || res.data.tutor),
				nameSetup: !!res.data.username
			})
		});
	}

	render() {
		if(!this.state.nameSetup){
			return(
				<Redirect to="/app/profile/set-username"/>
			)
		}
		else if(!this.state.roleSetup){
			return(
				<Redirect to="/app/profile/set-role"/>
			)
		}else{
			return(<div>EEEEE</div>)
		}
		// return (
		//     <h1>Profile</h1>
		// );
	}
}

export default Profile;
