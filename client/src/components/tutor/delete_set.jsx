import React, { Component } from "react";
import axios from "axios";

class DeleteSet extends Component {
    onSubmit = () => {
        const set_id = this.props.set.id;
        axios.delete(`/api/tutors/sets/${set_id}`).then((res) => {
            this.props.loadSets();
            this.props.popupMethod(false);
        });
    };

    render() {
        return (
            <div>
                <p>
                    Are you sure you want to delete{" "}
                    <em>{this.props.set.title}</em>?<br />
                    <strong>This action cannot be undone.</strong>
                </p>
                <div className="close-cancel-cont">
                    <button className="button-w" onClick={this.onSubmit}>
                        Delete Set
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

export default DeleteSet;
