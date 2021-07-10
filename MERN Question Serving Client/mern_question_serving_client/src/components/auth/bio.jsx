import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Bio extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	value: '',
        	err: null
        }
    }

    componentDidMount = () => {
    	console.log(this.props.user);
    	this.setState({
    		value: this.props.user.bio 
    	});
    }

	onChange = e => {
		this.setState({value: e.target.value})
	}

	onSubmit = e => {
		e.preventDefault();
		axios.post('/api/users/put/', {
			bio: this.state.value
		}).then(res => {
			this.props.history.push(`/app/profile/${this.props.user.username}`);
		}).catch(err => {
			if (err.response?.data.err){
				this.setState({err: err.response.data.err})
			}
		});
	}

    render() {
        return (
            <form className="choose-bio-outer setup-section-outer" onSubmit={this.onSubmit}>
            	<div className="setup-header-err-cont">
					<h1 className="choose-bio-header">Write yourself a bio</h1>
					<span className="err">{this.state.err}</span>
            	</div>
				<div className="choose-bio-input-error-cont">
					<textarea className="choose-bio-input" type="text" name="bio" placeholder="Bio" value={this.state.value} onChange={this.onChange} maxlength="512"/>
					<span className="err">{this.state.err}</span>
				</div>
				<input className="choose-bio-submit button-a" type="submit"/>
			</form>
        );
    }
}


export default withRouter(Bio);
