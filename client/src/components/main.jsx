import React, { Component } from "react";
import TutorPanel from "./tutor/tutor_panel";
import StudentPanel from "./student/student_panel";
import axios from "axios";
import SetController from "./student/set_controller";
import Setup from "./auth/setup";
import { withRouter } from "react-router-dom";
import Footer from "./footer";
import { Switch, Route, Link, Redirect } from "react-router-dom";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
        };
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate() {
        try {
            document.documentElement.style.setProperty(
                "--nav-height",
                document.getElementsByTagName("nav")[0].offsetHeight + "px"
            );
        } catch (err) {
            console.log(err);
        }
    }

    getUser = () => {
        axios
            .get("/api/users/")
            .then((res) => {
                this.setState({ user: res.data });
                if (
                    !res.data.username |
                        !res.data.displayName |
                        !(res.data.tutor | res.data.student) &&
                    !window.location.contains("app/setup/")
                ) {
                    window.location.replace("/app/setup");
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.replace("/login");
                }
            });
    };

    updateUser = () => {
        axios
            .get("/api/users/")
            .then((res) => {
                this.setState({ user: res.data });
                console.log(res.data);
                this.props.history.push(`/app/profile/${res.data.username}`);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    window.location.replace("/login");
                } else {
                    console.log(err);
                }
            });
    };

    render() {
        if (this.state.user) {
            return (
                <div>
                    <nav>
                        <div className="nav-left">
                            {this.state.user.tutor && (
                                <Link to="/app/tutor">Tutor</Link>
                            )}
                            {this.state.user.student && (
                                <Link to="/app/student">Student</Link>
                            )}
                            <a href="/auth/logout">Log Out</a>
                        </div>
                        <div className="nav-right">
                            <Link to={`/profile/${this.state.user.username}`}>
                                <img
                                    className="nav-profile-icon"
                                    alt={`${this.state.user.displayName}'s profile picture`}
                                    src={this.state.user?.profileIcon}
                                />
                            </Link>
                        </div>
                    </nav>
                    <div className="main-inner">
                        <Switch>
                            <Route path="/app/tutor">
                                <TutorPanel />
                            </Route>
                            <Route path="/app/student/:set_id">
                                <SetController />
                            </Route>
                            <Route path="/app/student">
                                <StudentPanel />
                            </Route>
                            <Route path="/app/setup">
                                <Setup
                                    user={this.state.user}
                                    updateUser={this.updateUser}
                                />
                            </Route>
                            <Route path="/app/">
                                <Redirect
                                    to={`/app/${
                                        this.state.user.tutor
                                            ? "tutor"
                                            : this.state.user.student
                                            ? "student"
                                            : "setup"
                                    }`}
                                />
                            </Route>
                        </Switch>
                    </div>
                    <Footer />
                </div>
            );
        } else {
            return <em>Give us a second</em>;
        }
    }
}

export default withRouter(Main);
