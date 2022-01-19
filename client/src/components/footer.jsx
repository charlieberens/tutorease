import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
    componentDidMount() {
        try {
            document.documentElement.style.setProperty(
                "--footer-height",
                document.getElementsByClassName("footer")[0].offsetHeight + "px"
            );
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="footer">
                <span className="footer-left">
                    Created by{" "}
                    <a
                        href="https://www.charlieberens.org"
                        className="primary-a"
                    >
                        Charlie Berens
                    </a>
                </span>
                <div className="footer-right">
                    <Link to="/feedback" className="footer-right-link">
                        Feedback
                    </Link>
                    <Link to="/about" className="footer-right-link">
                        About
                    </Link>
                </div>
            </div>
        );
    }
}

export default Footer;
