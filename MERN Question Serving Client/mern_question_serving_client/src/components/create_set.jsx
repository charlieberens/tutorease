import React, { Component, PropTypes } from 'react';

class CreateSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	name: '',
        	author: '' //ID
        }
    }

    render() {
        return (
        	<div>
        		<h2>Create Set</h2>
	            <form className="create-set">
	            	<input type="text" name="setName" placeholder="Set Name" class="create-set-set-name-input"/><br/>
	            	<input type="submit" name="submitSet" className="button-a"/>
	            </form>
            </div>
        );
    }
}

export default CreateSet;
