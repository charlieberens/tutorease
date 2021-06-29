import React, { Component, PropTypes } from 'react';
import axios from 'axios';

const tutor_id = '60b9708d0ace8e1c0c836b60';

class DeleteQuestion extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit = () => {
        const question_id = this.props.question.question_id;
        const set_id = this.props.set_id;
        axios.delete(`/api/tutors/set/${set_id}/${question_id}`)
        .then(res => {
            this.props.loadQuestions();
            this.props.popupMethod(false);
        });
    }

    render() {
        return (
            <div>
                <p>Are you sure you want to delete <em>Question {this.props.question.index + 1}</em>?<br/><strong>This action cannot be undone.</strong></p>
                <div className="close-cancel-cont">
                    <button className="button-w" onClick={this.onSubmit}>Delete Question</button>
                    <button className="button-g" onClick={() => this.props.popupMethod(false)}>Cancel</button>
                </div>
            </div>

        );
    }
}

export default DeleteQuestion;
