import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class DisplayName extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	value: null
        }
    }

    componentDidMount = () => {
    	this.setState({
    		value: this.props.user.displayName
    	})
    }

	onChange = e => {
		this.setState({value: e.target.value})
	}

	onSubmit = e => {
		e.preventDefault();
		axios.post('/api/users/put/', {
			displayName: this.state.value
		}).then(res => {
			this.props.history.push("/app/setup/bio");
		}).catch(err => {
			if(err.response?.data.err){
				this.setState({err: err.response.data.err})
			}
		});
	}

    render() {
        return (
            <div className="choose-display-name-outer">
				<h1 className="choose-display-name-header">Choose a display name</h1>
				<form className="choose-display-name-inner" onSubmit={this.onSubmit}>
					<div className="choose-display-name-input-error-cont">
						<input className="choose-display-name-input" type="text" name="display-name" placeholder="Display Name" value={this.state.value} onChange={this.onChange}/>
						<span className="err">{this.state.err}</span>
					</div>
					<input className="choose-display-name-submit" type="submit"/>
				</form>
			</div>
        );
    }
}

export default withRouter(DisplayName);