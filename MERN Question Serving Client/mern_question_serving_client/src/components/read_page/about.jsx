import React, { Component, PropTypes } from 'react';

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
			<>
            	<h1>About</h1>
            	<p>Hey I'm <a href="https://www.charlieberens.org" className="primary-a">Charlie Berens</a>. I couldn't find a simple tool to assign customized questions to the students I tutor, so wrote one!</p>
            	<span className="about-copy">&copy; Charlie Berens 2021</span>
            </>
        );
    }
}

export default About;
