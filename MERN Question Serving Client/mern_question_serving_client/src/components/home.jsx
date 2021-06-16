import React, { Component, PropTypes } from 'react';

import {Link} from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
       	<div>
	        <h1>This is the home page!</h1>
			<Link to="/">Home</Link>
			<Link to="/app/tutor">Tutors</Link>
			<Link to="/app/profile">Profile</Link>
			<Link to="/login">Log In</Link>	        
       	</div>
        );
    }
}

export default Home;
