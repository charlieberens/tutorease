import React, { Component, PropTypes } from 'react';
import Question from './question';

class SetGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            question_number: 0
        }
    }

    render() {
        console.log('numAnswered', this.props.set.numAnswered)
        if(this.state.question_number === 0){
            return (
                <div className="set-game-start">
                    <div className="set-game-start-title">
                        <div className="set-game-start-title-left">
                            <h1>{this.props.set.set.title}</h1>
                            <span className="set-game-start-question-count">{this.props.set.set.length} {this.props.set.set.length > 1 ? 'Questions': 'Question'}</span>
                        </div>
                        <div className="set-game-start-title-right">
                            <div className="set-game-start-tutor-icon-cont">
                                <img className="set-game-start-tutor-icon" src={this.props.set.tutor.icon}/>
                            </div>
                        </div>
                    </div>
                    <div className="set-game-start-main">
                        <p>{this.props.set.set.description ? this.props.set.set.description: 'lorem ipsum dolor sit amet'}</p>
                        <div className="set-game-start-button-cont">
                            <button className="button-a set-game-start-button" onClick={() => this.setState({question_number: this.props.set.numAnswered + 1})}>{!this.props.set.numAnswered ? 'Start' : 'Resume'}</button>
                        </div>
                    </div>
                </div>
            );
        }else{
            return (
                <div className="set-game-question">
                    <Question/>
                </div>
            )
        }
    }
}

export default SetGame;
