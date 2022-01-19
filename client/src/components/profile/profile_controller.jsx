import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ViewStudentPerformance from "../tutor/view_student_performance";
import Profile from "./profile";
import Page404 from "../page_404";
import Footer from "../footer";
import Back from "../back";

class ProfileControler extends Component {
    render() {
        return (
            <div className="profile-controller">
                <div className="profile-controller-inner trad-cont">
                    <Switch>
                        <Route path="/profile/:student_username/performance">
                            <ViewStudentPerformance />
                        </Route>
                        <Route path="/profile/:username">
                            <Back to="/app" className="top-left" />
                            <Profile
                                current_username={this.props.current_username}
                            />
                        </Route>
                        {this.props.current_username ? (
                            <Route path="/profile/">
                                <Redirect
                                    to={`/profile/${this.props.current_username}`}
                                />
                            </Route>
                        ) : (
                            <Page404 />
                        )}
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}

export default ProfileControler;
