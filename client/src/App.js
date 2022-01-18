import "./styles/app.css";
import { Component } from "react";
import Main from "./components/main";
import Home from "./components/home";
import Login from "./components/auth/login";
import StudentTutorSelect from "./components/auth/student_tutor_select";
import Username from "./components/auth/username";
import Page404 from "./components/page_404";
import ReadPageController from "./components/read_page/read_page_controller";
import ProfileController from "./components/profile/profile_controller";
import axios from "axios";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
        };
    }

    componentDidMount = () => {
        this.getUserId();
    };

    getUserId = async () => {
        const res = await axios.get("/api/users/", {
            params: {
                fields: ["username"],
            },
        });
        if (res.data.username) {
            this.setState({ username: res.data.username });
        }
    };

    render() {
        return (
            <div className="App">
                {/* Popups */}
                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/app/profile/set-role">
                            <StudentTutorSelect />
                        </Route>
                        <Route path="/app/profile/set-username">
                            <Username />
                        </Route>
                        <Route path="/app/">
                            <Main />
                        </Route>
                        <Route path="/profile/">
                            <ProfileController
                                current_username={this.state.username}
                            />
                        </Route>
                        <Route path="/LaTeX">
                            <ReadPageController />
                        </Route>
                        <Route path="/about">
                            <ReadPageController />
                        </Route>
                        <Route path="/feedback">
                            <ReadPageController />
                        </Route>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/">
                            <Page404 />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
