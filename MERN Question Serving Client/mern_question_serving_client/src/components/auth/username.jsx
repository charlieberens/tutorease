import React, { Component, PropTypes } from 'react';
import axios from 'axios';

import { withRouter } from "react-router-dom";

class Username extends Component {
	constructor(props) {
		super(props);
		this.state = {
			err: null,
			value: ''
		}
	}

	componentDidMount = () => {
		this.setState({
			value: this.props.user.username
		})
	}

	onChange = e => {
		this.setState({value: e.target.value})
	}

	onSubmit = e => {
		e.preventDefault();
		axios.post('/api/users/put/', {
			username: this.state.value
		}).then(res => {
			this.props.history.push("/app/setup/display-name");
		}).catch(err => {
			if (err.response?.data.err){
				this.setState({err: err.response.data.err})
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
						<span className="err">{this.state.err}</span>
					</div>
					<input className="choose-username-submit" type="submit"/>
				</form>
			</div>
		);
	}
}

export default withRouter(Username);
