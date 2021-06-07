import React, { Component, PropTypes } from 'react';
import axios from 'axios';

const tutorID = '60b9708d0ace8e1c0c836b60';

axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

class CreateSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	title: ''
        }
    }

    onChange = e => {
        this.setState({title: e.target.value});
    }

    onSubmit = e => {
        console.log({
            title: this.state.title,
            author_id: tutorID
        })
        console.log('e');
        e.preventDefault();
        axios.post('/api/tutors/sets/', {
            title: this.state.title,
            author_id: tutorID
        })
        .then(res => {
            // close popup
            this.props.popupMethod(false, 0)
            this.props.loadSets()
        })
    }

    render() {
        return (
        	<div>
        		<h2>Create Set</h2>
	            <form className="create-set">
	            	<input type="text" name="setTitle" placeholder="Set Name" class="create-set-set-name-input" onChange={this.onChange}/><br/>
	            	<input type="submit" name="submitSet" className="button-a" onClick={this.onSubmit}/>
	            </form>
            </div>
        );
    }
}

export default CreateSet;
