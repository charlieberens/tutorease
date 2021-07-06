import React, { Component, PropTypes } from 'react';

import {Link} from "react-router-dom";
import '../styles/home.css'

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
       	<div className="home-outer">
            <div className="home-center">
                <h1>This is Filler Name</h1>
                <p>Where independent educators can easily assign their students questions</p>
                <Link className="home-login-button button-a pill" to="/login">Begin</Link>
            </div>
       	</div>
        );
    }
}

export default Home;
