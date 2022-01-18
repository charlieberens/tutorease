import React, { Component } from "react";
import { IoAddCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            pendingStudents: [],
        };
    }

    componentDidMount = () => {
        this.loadStudents();
    };

    loadStudents = () => {
        axios
            .get("/api/students/list-students")
            .then((res) => {
                this.setState({ students: res.data.students });
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get("/api/students/invite/list-outgoing")
            .then((res) => {
                this.setState({ pendingStudents: res.data.requests });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className="student-list-module">
                <h2>Students</h2>
                <div className="student-list">
                    {this.state.students.map((student, index) => (
                        <Link
                            to={`/profile/${student.username}`}
                            className="student-list-item student-list-student"
                        >
                            <img
                                className="student-list-item-left"
                                src={student.profileIcon}
                            />
                            <div className="student-list-item-right">
                                <h3 className="student-list-student-displayName">
                                    {student.displayName}
                                </h3>
                                <span className="student-list-student-username">
                                    @{student.username}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {this.state.pendingStudents.map((student, index) => (
                        <Link
                            to={`/profile/${student.username}`}
                            className="student-list-item student-list-pending"
                        >
                            <img
                                className="student-list-item-left"
                                src={student.profileIcon}
                            />
                            <div className="student-list-item-right">
                                <h3 className="student-list-student-displayName">
                                    {student.displayName}
                                </h3>
                                <span className="student-list-student-username">
                                    @{student.username}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="student-list-module-bottom">
                    <Link
                        to="/app/tutor/add-student"
                        className="student-list-add-student-link"
                    >
                        <IoAddCircle className="student-list-add-student-link-add" />
                        Invite Student
                    </Link>
                </div>
            </div>
        );
    }
}

export default StudentList;
