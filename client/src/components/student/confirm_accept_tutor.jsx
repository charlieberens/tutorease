import React, { Component } from "react";
import axios from "axios";

class ConfirmAcceptTutor extends Component {
    onSubmit = () => {
        axios
            .post(`/api/students/invite/accept/${this.props.tutor._id}`)
            .then((res) => {
                this.props.popupMethod(false);
                this.props.reloadMethod();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div>
                <p>
                    Add{" "}
                    <em>
                        {this.props.tutor.displayName} (@
                        {this.props.tutor.username})
                    </em>{" "}
                    as a tutor?
                    <br />
                </p>
                <div className="close-cancel-cont">
                    <button className="button-a" onClick={this.onSubmit}>
                        Add
                    </button>
                    <button
                        className="button-g"
                        onClick={() => this.props.popupMethod(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}

export default ConfirmAcceptTutor;
