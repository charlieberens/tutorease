import React, { Component, PropTypes } from 'react';
import axios from 'axios';

const tutorID = '60b9708d0ace8e1c0c836b60';

axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

class CreateSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	title: '',
            err: ''
        }
    }

    onChange = e => {
        this.setState({title: e.target.value});
    }

    onSubmit = e => {
        e.preventDefault();
        axios.post('/api/tutors/sets/', {
            title: this.state.title
        })
        .then(res => {
            // close popup
            this.props.popupMethod(false);
            this.props.loadSets();
        }).catch(err => {
            if (err.response?.data.err){
                this.setState({err: err.response.data.err})
            }
        })
    }

    render() {
        return (
        	<div>
        		<h2>Create Set</h2>
	            <form className="create-set" autocomplete="off">
                    <span className="err">{this.state.err}</span>
	            	<input type="text" name="setTitle" placeholder="Set Name" class="create-set-set-name-input" onChange={this.onChange}/><br/>
                    <div className="close-cancel-cont">
                        <input type="submit" name="submitSet" className="button-a" onClick={this.onSubmit} value="Create"/>
                        <button className="button-g" onClick={() => this.props.popupMethod(false)}>Cancel</button>
                    </div>
	            </form>
            </div>
        );
    }
}

export default CreateSet;
