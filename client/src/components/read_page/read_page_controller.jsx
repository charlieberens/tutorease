import React, { Component } from "react";
import LatexPage from "./latex_page";
import Feedback from "./feedback";
import Footer from "../footer";
import About from "./about";
import { Route, Switch } from "react-router-dom";
import Back from "../back";

class ReadPageController extends Component {
    render() {
        return (
            <>
                <div className="read-page trad-cont">
                    <div className="read-page-inner">
                        <Back />
                        <Switch>
                            <Route path="/LaTeX">
                                <LatexPage />
                            </Route>
                        </Switch>
                        <Switch>
                            <Route path="/feedback">
                                <Feedback />
                            </Route>
                        </Switch>
                        <Switch>
                            <Route path="/about">
                                <About />
                            </Route>
                        </Switch>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}

export default ReadPageController;
