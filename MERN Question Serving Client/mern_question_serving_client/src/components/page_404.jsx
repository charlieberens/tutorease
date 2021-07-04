import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

class Page404 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-404-outer">
            	<div className="page-404-inner">
	            	<h1>404</h1>
	            	<p>You seem to be lost...</p>
	            	<Link to={this.props.redirect_url ? this.props.redirect_url : '/'}>Bring me home</Link>
            	</div>
            </div>
        );
    }
}

export default Page404;
