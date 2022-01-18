import React, { Component } from "react";
import Question from "./question";
import { withRouter } from "react-router-dom";

class SetGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionNumber: 0,
            completed: false,
        };
    }

    componentDidMount = () => {
        if (this.props.set.completed) {
            this.setState({
                completed: this.props.set.completed,
                questionNumber: this.props.set.set.questions.length + 1,
            });
        }
    };

    nextQuestion = (review) => {
        if (
            !review &&
            this.state.questionNumber === this.props.set.set.questions.length
        ) {
            this.setState({ completed: true });
        }
        this.setState((state) => ({
            questionNumber: state.questionNumber + 1,
        }));
    };
    resume = () => {
        if (this.state.questionNumber === this.props.set.set.questions.length) {
            this.setState({ completed: true });
        }
        this.setState((state) => ({
            questionNumber: state.questionNumber + 1,
        }));
    };
    prevQuestion = () => {
        this.setState({ questionNumber: this.props.set.numAnswered - 1 });
    };

    getNumCorrect = () => {
        return this.props.set.set.questions.filter(
            (question) => question.responses.length === 1
        ).length;
    };

    render() {
        console.log(this.props.set);
        if (this.state.questionNumber === 0 && !this.state.completed) {
            return (
                <div className="set-game-start set-game">
                    <div className="set-game-start-title">
                        <div className="set-game-start-title-left">
                            <h1>{this.props.set.set.title}</h1>
                            <span className="set-game-start-question-count">
                                {this.props.set.set.length}{" "}
                                {this.props.set.set.length > 1
                                    ? "Questions"
                                    : "Question"}
                            </span>
                        </div>
                        <div className="set-game-start-title-right">
                            <div className="set-game-start-tutor-icon-cont">
                                <img
                                    className="set-game-start-tutor-icon"
                                    src={this.props.set.tutor.icon}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="set-game-start-main">
                        <p>
                            {this.props.set.set.description
                                ? this.props.set.set.description
                                : "Set descriptions coming soon"}
                        </p>
                        <div className="set-game-start-button-cont">
                            <button
                                className="button-a set-game-start-button"
                                onClick={this.resume}
                            >
                                {!this.props.set.numAnswered
                                    ? "Start"
                                    : "Resume"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (
            this.state.questionNumber <= this.props.set.set.questions.length &&
            !this.state.completed
        ) {
            return (
                <div className="set-game-question set-game">
                    <div className="question-number-cont">
                        <span className="question-number">
                            {this.state.questionNumber}
                        </span>
                    </div>
                    <Question
                        question={
                            this.props.set.set.questions[
                                this.state.questionNumber - 1
                            ]
                        }
                        set_length={this.props.set.set.questions.length}
                        set_id={this.props.set.set.id}
                        question_index={this.state.questionNumber - 1}
                        nextQuestion={this.nextQuestion}
                        review={false}
                    />
                </div>
            );
        } else if (
            this.state.questionNumber <= this.props.set.set.questions.length &&
            this.state.completed
        ) {
            return (
                <div className="set-game-rev-question set-game">
                    <div className="question-number-cont">
                        <span className="question-number">
                            {this.state.questionNumber}
                        </span>
                    </div>
                    <Question
                        question={
                            this.props.set.set.questions[
                                this.state.questionNumber - 1
                            ]
                        }
                        set_id={this.props.set.set.id}
                        question_index={this.state.questionNumber - 1}
                        nextQuestion={this.nextQuestion}
                        set_length={this.props.set.set.questions.length}
                        review={true}
                        prevQuestion={this.prevQuestion}
                    />
                </div>
            );
        } else {
            return (
                <div className="set-game-complete set-game">
                    <div className="set-game-complete-title">
                        <div className="set-game-complete-title-left">
                            <h1>{this.props.set.set.title}</h1>
                            <span className="set-game-complete-question-count">
                                {this.props.set.set.length}{" "}
                                {this.props.set.set.length > 1
                                    ? "Questions"
                                    : "Question"}
                            </span>
                        </div>
                        <div className="set-game-complete-title-right">
                            <div className="set-game-complete-tutor-icon-cont">
                                <img
                                    className="set-game-complete-tutor-icon"
                                    src={this.props.set.tutor.icon}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="set-game-complete-main">
                        <div className="set-game-complete-score-cont">
                            <h2 className="set-game-complete-score">
                                {this.getNumCorrect()} out of{" "}
                                {this.props.set.set.questions.length} correct
                            </h2>
                        </div>
                        <div className="set-game-complete-button-cont">
                            <button
                                className="button-a set-game-review-button"
                                onClick={() =>
                                    this.setState({ questionNumber: 1 })
                                }
                            >
                                Review
                            </button>
                            <button
                                className="button-a set-game-finish-button"
                                onClick={() =>
                                    this.props.history.push("/app/student")
                                }
                            >
                                Finish
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(SetGame);
