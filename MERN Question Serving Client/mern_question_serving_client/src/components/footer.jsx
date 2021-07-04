import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer">
            	<span className="footer-left">Created by <a href="https://www.charlieberens.org">Charlie Berens</a></span>
            	<div className="footer-right">
            		<Link to="/feedback" className="footer-right-link">Feedback</Link>
            		<Link to="/about" className="footer-right-link">About</Link>
            	</div>
            </div>
        );
    }
}

export default Footer;
