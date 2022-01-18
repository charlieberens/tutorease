import React, { Component } from "react";

import { Link } from "react-router-dom";
import "../styles/home.css";
import Footer from "./footer";

class Home extends Component {
    render() {
        return (
            <div className="home-outer">
                <div className="home-flex">
                    <div className="home-center">
                        <h1>This is Tutorease</h1>
                        <p>
                            Where independent educators can easily assign
                            questions
                        </p>
                        <Link
                            className="home-login-button button-a pill"
                            to="/login"
                        >
                            Begin
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Home;
