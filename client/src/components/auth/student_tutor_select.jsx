import React, { Component } from "react";
import {
    IoSchool,
    IoSchoolOutline,
    IoBook,
    IoBookOutline,
} from "react-icons/io5";
import axios from "axios";

import "../../styles/auth.css";

import { withRouter } from "react-router-dom";

class StudentTutorSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentSelected: false,
            tutorSelected: false,
        };
    }

    componentDidMount = () => {
        this.setState({
            studentSelected: this.props.user.student,
            tutorSelected: this.props.user.tutor,
        });
    };

    flipSelect = (student) => {
        if (student) {
            this.setState((state) => ({
                studentSelected: !state.studentSelected,
            }));
        } else {
            this.setState((state) => ({
                tutorSelected: !state.tutorSelected,
            }));
        }
    };

    sendRoleSelect = (e) => {
        e.preventDefault();

        axios
            .post("/api/users/put/", {
                tutor: this.state.tutorSelected,
                student: this.state.studentSelected,
            })
            .then((res) => {
                this.props.history.push("/app/setup/username");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <form className="tutor-student-select-outer setup-section-outer">
                <h1>What are you?</h1>
                <div className="tutor-student-select-inner">
                    <div
                        className={`tutor-student-item ${
                            this.state.studentSelected && "selected"
                        }`}
                        onClick={() => this.flipSelect(true)}
                    >
                        <div className="tutor-student-item-top">
                            {!this.state.studentSelected ? (
                                <IoBookOutline />
                            ) : (
                                <IoBook />
                            )}
                        </div>
                        <h2>Student</h2>
                    </div>
                    <div
                        className={`tutor-student-item ${
                            this.state.tutorSelected && "selected"
                        }`}
                        onClick={() => this.flipSelect(false)}
                    >
                        <div className="tutor-student-item-top">
                            {!this.state.tutorSelected ? (
                                <IoSchoolOutline />
                            ) : (
                                <IoSchool />
                            )}
                        </div>
                        <h2>
                            Teacher/
                            <wbr />
                            Tutor
                        </h2>
                    </div>
                </div>
                <button
                    className="tutor-student-button button-a"
                    disabled={
                        !(
                            this.state.studentSelected ||
                            this.state.tutorSelected
                        )
                    }
                    onClick={this.sendRoleSelect}
                >
                    Continue
                </button>
            </form>
        );
    }
}

export default withRouter(StudentTutorSelect);
