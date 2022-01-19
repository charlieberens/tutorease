import React, { Component } from "react";
import { IoArrowBack } from "react-icons/io5";
import { withRouter } from "react-router-dom";

class Back extends Component {
    clickHandler = () => {
        if (this.props.to) {
            this.props.history.push(this.props.to);
        } else if (this.props.goGack) {
            this.props.history.goBack();
        } else {
            let url = window.location.pathname;
            if (url[url.length - 1] === "/") {
                url = url.slice(0, -1);
            }
            let new_url = url.slice(0, url.lastIndexOf("/"));
            this.props.history.push(new_url);
        }
    };

    render() {
        return (
            <a
                onClick={this.clickHandler}
                className={`back-link ${this.props.className}`}
            >
                <IoArrowBack />
                {this.props.text ? this.props.text : "Go back"}
            </a>
        );
    }
}

export default withRouter(Back);
