import React, { Component } from "react";
import axios from "axios";
import { IoCheckmark, IoClose } from "react-icons/io5";
import ConfirmAcceptTutor from "./confirm_accept_tutor";
import Popup from "../popup";
import { Link } from "react-router-dom";

class TutorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            tutorRequests: [],
            acceptTutorPopup: false,
            rejectTutorPopup: false,
            inBay: null, //ID of tutor that's passed to popup
        };
    }

    componentDidMount = () => {
        this.loadTutors();
    };

    loadTutors = () => {
        axios.get("/api/students/list-tutors").then((res) => {
            this.setState({ tutors: res.data.tutors });
        });
        axios.get("/api/students/invite/list-incoming").then((res) => {
            this.setState({ tutorRequests: res.data.requests });
        });
    };

    controlAcceptTutorPopup = (bool) => {
        this.setState({ acceptTutorPopup: bool });
    };
    controlRejectTutorPopup = (bool) => {
        this.setState({ reject: bool });
    };

    render() {
        return (
            <>
                {!this.state.tutors?.length && (
                    <div>
                        <em>You don't have any tutors.</em>
                    </div>
                )}

                <div className="tutor-list">
                    {this.state.tutors.map((tutor, index) => (
                        <Link
                            className="tutor-list-item tutor-list-student"
                            to={`/profile/${tutor.username}`}
                        >
                            <img
                                className="tutor-list-item-inner-left"
                                src={tutor.profileIcon}
                            />
                            <div className="tutor-list-item-inner-right">
                                <h3 className="tutor-list-student-displayName">
                                    {tutor.displayName}
                                </h3>
                                <span className="tutor-list-student-username">
                                    @{tutor.username}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {this.state.tutorRequests.map((tutor, index) => (
                        <div className="tutor-list-item tutor-list-pending">
                            <Link
                                to={`/profile/${tutor.username}`}
                                className="tutor-list-item-outer-left"
                            >
                                <img
                                    className="tutor-list-item-inner-left"
                                    src={tutor.profileIcon}
                                    to={`/profile/${tutor.username}`}
                                />
                                <div className="tutor-list-item-inner-right">
                                    <h3 className="tutor-list-student-displayName">
                                        {tutor.displayName}
                                    </h3>
                                    <span className="tutor-list-student-username">
                                        @{tutor.username}
                                    </span>
                                </div>
                            </Link>
                            <div className="tutor-list-item-outer-right">
                                <button
                                    className="button-s"
                                    onClick={() =>
                                        this.setState({
                                            inBay: tutor,
                                            acceptTutorPopup: true,
                                        })
                                    }
                                >
                                    <IoCheckmark />
                                </button>
                                <button className="button-w">
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.acceptTutorPopup && (
                    <Popup popupMethod={this.controlAcceptTutorPopup}>
                        <ConfirmAcceptTutor
                            reloadMethod={this.loadTutors}
                            popupMethod={this.controlAcceptTutorPopup}
                            tutor={this.state.inBay}
                        />
                    </Popup>
                )}
            </>
        );
    }
}

export default TutorList;
