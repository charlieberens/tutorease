import React, { Component } from "react";

class Feedback extends Component {
    render() {
        return (
            <>
                <h1>Feedback</h1>
                <p>
                    Despite what my mother says, I am not perfect. Notice any
                    bugs? Have any suggestions? Email me at{" "}
                    <a
                        href="mailto:charliejberens@gmail.com"
                        className="primary-a"
                    >
                        charliejberens@gmail.com
                    </a>
                </p>
            </>
        );
    }
}

export default Feedback;
