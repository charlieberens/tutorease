import React, { Component, PropTypes } from 'react';
import axios from 'axios';

import { withRouter } from "react-router-dom";

class Username extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			value: ''
		}
	}

	onChange = e => {
		this.setState({value: e.target.value})
	}

	onSubmit = e => {
		e.preventDefault();
		axios.post('/api/users/username/', {
			username: this.state.value
		}).then(res => {
			this.props.history.push("/app/profile");
		}).catch(err => {
			if (err.response && err.response.data){
				if(err.response.data.message === 'chars'){
					this.setState({error: 'Username may only contain letters A-Z, numbers 0-9, -, and _'})
				}else if(err.response.data.message === 'taken'){
					this.setState({error: 'Username already taken'})
				}else if(err.response.data.message === 'length'){
					this.setState({error: 'Username must be between 4 and 36 characters'})
				}
			}
		});
	}

	render() {
		return (
			<div className="choose-username-outer">
				<h1 className="choose-username-header">Choose a username</h1>
				<form className="choose-username-inner" onSubmit={this.onSubmit}>
					<div className="choose-username-input-error-cont">
						<input className="choose-username-input" type="text" name="username" placeholder="Username" value={this.state.value} onChange={this.onChange}/>
						{this.state.error &&
							<span className="choose-username-error">{this.state.error}</span>
						}
					</div>
					<input className="choose-username-submit" type="submit"/>
				</form>
			</div>
		);
	}
}

export default withRouter(Username);
