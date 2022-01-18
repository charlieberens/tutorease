import React, { Component } from "react";
import { IoArrowBack } from "react-icons/io5";
import { withRouter } from "react-router-dom";

class Back extends Component {
    clickHandler = () => {
        if (this.props.to) {
            window.location.replace(this.props.to);
        } else {
            this.props.history.goBack();
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
