import React, { Component } from "react";
import { withRouter, Link, Route, Switch } from "react-router-dom";
import axios from "axios";
import Popup from "../popup";
import AssignSet from "./assign_set";
import SetQuestions from "./set_questions";
import SetPerformance from "./set_performance";
import ReviewPerformance from "./review_performance";
import Back from "../back";

class Set extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            assignQuestionPopupOpen: false,
            set_path: `${this.props.base_path}/${this.props.match.params.id}`,
            title: null,
            date: null,
            questions: null,
            loading: true,
        };
    }

    componentDidMount = () => {
        this.loadSet();
    };

    loadSet = () => {
        this.setState({ loading: true });
        axios
            .get(`/api/tutors/set/${this.props.match.params.id}`)
            .then((res) => {
                console.log({ res });
                const tempQuestions = res.data.questions.map((question) => ({
                    ...question,
                    popupOpen: false,
                }));
                console.log({ data: res.data });
                this.setState({
                    title: res.data.title,
                    date: res.data.date,
                    questions: tempQuestions,
                    students: res.data.students,
                    loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    controlAssignQuestionPopup = (bool) => {
        this.setState({ assignQuestionPopupOpen: bool });
    };

    render() {
        if (this.state.loading) {
            return <div>Give us a sec</div>;
        } else {
            return (
                <>
                    <div>
                        <nav className="tutor-set-nav">
                            <Link
                                className={`grey-a ${
                                    !window.location.pathname.includes(
                                        "performance"
                                    ) && "selected"
                                } nav-item`}
                                to={`${this.state.set_path}`}
                            >
                                Set
                            </Link>
                            <Link
                                className={`grey-a ${
                                    window.location.pathname.includes(
                                        "performance"
                                    ) && "selected"
                                } nav-item`}
                                to={`${this.state.set_path}/performance`}
                            >
                                Performance
                            </Link>
                        </nav>
                        <div className="set-title-cont">
                            <Back />
                            <h1>{this.state.title}</h1>
                            <a
                                onClick={() =>
                                    this.controlAssignQuestionPopup(true)
                                }
                                className="primary-a"
                            >
                                Assign Set
                            </a>
                        </div>
                        <Switch>
                            <Route
                                path={`/app/tutor/sets/:set_id/performance/:student_username`}
                            >
                                <ReviewPerformance
                                    set_id={this.props.match.params.id}
                                    set={{ questions: this.state.questions }}
                                    base_path={`${this.props.base_path}/${this.props.match.params.id}/performance`}
                                />
                            </Route>
                            <Route path={`${this.state.set_path}/performance`}>
                                <SetPerformance
                                    id={this.props.match.params.id}
                                    set={{ questions: this.state.questions }}
                                    students={this.state.students}
                                    base_path={`${this.props.base_path}/${this.props.match.params.id}/performance`}
                                />
                            </Route>
                            <Route path={this.state.set_path}>
                                <SetQuestions
                                    id={this.props.match.params.id}
                                    questions={this.state.questions}
                                    loadSet={this.loadSet}
                                    editable={!this.state.students.length}
                                />
                            </Route>
                        </Switch>
                    </div>
                    {this.state.assignQuestionPopupOpen && ( //Create Question Popup
                        <Popup popupMethod={this.controlAssignQuestionPopup}>
                            <AssignSet
                                set_id={this.props.match.params.id}
                                set_title={this.state.title}
                                popupMethod={this.controlAssignQuestionPopup}
                                loadMethod={this.loadSet}
                            />
                        </Popup>
                    )}
                </>
            );
        }
    }
}

export default withRouter(Set);
