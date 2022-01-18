import React, { Component } from "react";
import { withRouter, Link, Switch, Route } from "react-router-dom";
import axios from "axios";
import Back from "../back";

class ViewStudentPerformance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorized: false,
        };
    }

    componentDidMount = () => {
        this.loadStudent();
    };

    loadStudent = async () => {
        const res = await axios.get(
            `/api/tutors/get-student-performance/sets/${this.props.match.params.student_username}`
        );
        if (res.data.noAuth) {
            this.setState({ authorized: false });
        } else {
            this.setState({
                displayName: res.data.displayName,
                username: this.props.match.params.student_username,
                profileIcon: res.data.profileIcon,
                sets: res.data.sets.sort(
                    (a, b) =>
                        new Date(
                            a.completeDate ? a.completeDate : "2500-07-20"
                        ) -
                        new Date(b.completeDate ? b.completeDate : "2500-07-20")
                ),
                authorized: true,
            });
        }
    };

    render() {
        console.log(this.state, this.props.match.params);
        if (this.state.authorized) {
            return (
                <Switch>
                    <Route path="/profile/:student_username/performance">
                        <Back className="top-left" />
                        {this.state.sets.length ? (
                            <div className="view-student-performance-cont">
                                {this.state.sets.map((set, index) => (
                                    <div
                                        className={`view-student-performance-item ${
                                            set.completeDate ? "" : "incomplete"
                                        }`}
                                    >
                                        <div className="set-performance-student-left">
                                            <div className="set-performance-student-left-right">
                                                <h3>{set.title}</h3>
                                            </div>
                                        </div>
                                        <div className="set-performance-student-bar"></div>
                                        {set.completeDate ? (
                                            <div className="set-performance-student-right completed">
                                                <div className="set-performance-student-right-top">
                                                    <span>
                                                        {set.numCorrect}
                                                    </span>{" "}
                                                    out of{" "}
                                                    <span>{set.setLength}</span>
                                                </div>
                                                <div className="set-performance-student-right-bottom">
                                                    <Link
                                                        className="grey-a"
                                                        to={`/app/tutor/sets/${set.id}/performance/${this.props.match.params.student_username}`}
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="set-performance-student-right">
                                                Not Completed
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="view-student-performance-no-performance-cont">
                                <span>
                                    You haven't assigned{" "}
                                    {this.state.displayName} any sets yet
                                </span>
                            </div>
                        )}
                    </Route>
                </Switch>
            );
        } else {
            return (
                <div>
                    <em>
                        @{this.props.match.params.student_username} is not your
                        student
                    </em>
                </div>
            );
        }
    }
}

export default withRouter(ViewStudentPerformance);
