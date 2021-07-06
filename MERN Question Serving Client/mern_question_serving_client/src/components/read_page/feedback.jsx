import React, { Component, PropTypes } from 'react';

class Feedback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            	<h1>Feedback</h1>
            	<p>Despite what my mother says, I am not perfect. Notice any bugs, have any suggestions? Email me at:</p>
            	<h2 className="feedback-email">filleremail@website.com</h2>
            </>
        );
    }
}

export default Feedback;
