import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

class AddStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: null,
            search_value: null,
            selected_student: null,
        };
    }

    onChange = (e) => {
        const val = e.target.value;
        this.setState({ search_value: val });
        if (val) {
            this.search(val);
        } else {
            this.setState({ students: null });
        }
    };

    search = (query_string) => {
        axios.get(`/api/students/search/${query_string}`).then((res) => {
            this.setState({ students: res.data.students });
        });
    };

    inviteStudent = () => {
        axios
            .post(`/api/students/invite/${this.state.selected_student._id}`)
            .then((res) => {
                this.props.history.push("/app/profile");
            });
    };

    render() {
        return (
            <div
                className={`add-student-cont ${
                    !this.state.search_value?.length && "add-student-no-search"
                }`}
            >
                <div className="add-student-desc">
                    <h3 className="add-student-header">Search for a student</h3>
                    <p className="add-student-text">
                        Either type their display name or their username
                        preceded by @
                    </p>
                </div>
                <input
                    className="add-student-searchbar"
                    type="text"
                    value={this.state.search_value}
                    onChange={this.onChange}
                    placeholder="Search for a student"
                />
                <div className="add-student-results-cont">
                    {this.state.students?.map((student, index) => (
                        <div
                            className="add-student-student"
                            onClick={() =>
                                this.setState({ selected_student: student })
                            }
                        >
                            <div className="add-student-student-left">
                                <img
                                    className="add-student-student-icon"
                                    src={student.profileIcon}
                                />
                            </div>
                            <div className="add-student-student-right">
                                <h3 className="add-student-displayname">
                                    {student.displayName}
                                </h3>
                                <div className="add-student-student-bottom">
                                    <p className="add-student-student-username">
                                        @{student.username}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!this.state.students?.length &&
                        !!this.state.search_value?.length && (
                            <span>No students found</span>
                        )}
                </div>

                {this.state.selected_student && (
                    <div>
                        <p>
                            Invite {this.state.selected_student.displayName} (@
                            {this.state.selected_student.username}) as a
                            student?
                        </p>
                        <button
                            className="button-a"
                            onClick={this.inviteStudent}
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(AddStudent);
