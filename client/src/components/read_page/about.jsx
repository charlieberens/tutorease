import React, { Component } from "react";

class About extends Component {
    render() {
        return (
            <>
                <h1>About</h1>
                <p>
                    Hey, I'm{" "}
                    <a
                        href="https://www.charlieberens.org"
                        className="primary-a"
                    >
                        Charlie Berens
                    </a>
                    . I couldn't find a simple tool to assign customized
                    questions to the students I tutor, so I built one!
                </p>
            </>
        );
    }
}

export default About;
