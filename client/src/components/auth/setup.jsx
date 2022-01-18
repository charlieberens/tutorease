import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import StudentTutorSelect from "./student_tutor_select";
import Username from "./username";
import DisplayName from "./display_name";
import Bio from "./bio";

class Setup extends Component {
    render() {
        return (
            <div className="setup-outer">
                <Switch>
                    <Route path="/app/setup/student-tutor-select">
                        <StudentTutorSelect user={this.props.user} />
                    </Route>
                    <Route path="/app/setup/username">
                        <Username user={this.props.user} />
                    </Route>
                    <Route path="/app/setup/display-name">
                        <DisplayName user={this.props.user} />
                    </Route>
                    <Route path="/app/setup/bio">
                        <Bio
                            user={this.props.user}
                            updateUser={this.props.updateUser}
                        />
                    </Route>
                    {/* <Route path="/app/setup/bio"> */}
                    {/* 	<Bio user={this.props.user}/> */}
                    {/* </Route> */}
                    <Route path="/app/setup/">
                        <Redirect to="/app/setup/student-tutor-select" />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default Setup;
