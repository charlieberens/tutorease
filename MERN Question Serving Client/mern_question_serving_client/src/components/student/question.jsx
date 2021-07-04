import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import Latex from 'react-latex';

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	answers: [],
            incorrectAnswers: [], //Indecies
            selected: null,
            correct: false,
            waiting: false
        }
    }

    selectAnswer = index => {
        if(!this.state.correct && !this.state.waiting){
            this.setState({selected: index})
        }
    }

    checkAnswer = async () => {
        this.setState({waiting: true})
        const index = this.state.selected;
        if(index != null){
            try{
                const answer = this.props.question.answers[index];
                this.props.question.responses.push(answer);
                const res = await axios.get(`/api/students/check/${this.props.set_id}/${this.props.question_index}`, {params: {answer: answer}});
                if(res.data.success){
                    this.setState({correct: true})
                    console.log(res.data)
                    if(res.data.responses.length === 1){
                        this.props.set.numCorrect += 1;
                    }
                }else{
                    let state = this.state;
                    state.incorrectAnswers.push(index);
                    this.setState({incorrectAnswers: state.incorrectAnswers, selected: null});
                }
            }catch(err){
                console.log(err)
            }
        }
        this.setState({waiting: false})
    }

    nextQuestion = () => {
        this.setState({selected: null, correct: false, incorrectAnswers: []})
        this.props.nextQuestion(this.props.review)
    }

    prevQuestion = () => {
        this.props.prevQuestion()
    }

    render() {
        console.log(this.props)
        if(!this.props.review){
            return (
                <div className="question">
                	<div className="question-body">
                        {this.props.question?.body?.split('\n').filter(section => section).map(textFragment => 
                            <p><Latex>{textFragment}</Latex></p>
                        )}      
                    </div>
                	<ul className={`answer-block  ${this.state.correct ? 'correct' : ''}`}>
                		{ this.props.question?.answers.map((answer, index) => 
                			<li key={index} className={`answer ${this.state.selected === index ? 'selected' : ''} ${this.state.incorrectAnswers.includes(index) ? 'incorrect' : ''}`} onClick={!this.state.incorrectAnswers.includes(index) && (() => this.selectAnswer(index))}>
                				<div className="answer-letter-outer">
                					<span className="answer-letter-inner">{alphabet[index]}</span>
            					</div>
            					<div className="answer-text"><Latex>{answer}</Latex></div>
        					</li>) }
                	</ul>
                    <button className="button-a" onClick={this.state.correct ? this.nextQuestion : this.checkAnswer} disabled={this.state.selected === null}>{this.state.correct ? 'Next' : 'Submit'}</button>
                </div>
            );
        }else{
            return (
                <div className="question review">
                    <div className="question-body">
                        {this.props.question?.body?.split('\n').filter(section => section).map(textFragment => 
                            <p><Latex>{textFragment}</Latex></p>
                        )}      
                    </div>
                    <ul className={`answer-block  ${this.state.correct ? 'correct' : ''}`}>
                        { this.props.question?.answers.map((answer, index) => 
                            <li key={index} className={`answer ${this.state.selected === index ? 'selected' : ''} ${this.state.incorrectAnswers.includes(index) ? 'incorrect' : ''}`} onClick={!this.state.incorrectAnswers.includes(index) && (() => this.selectAnswer(index))}>
                                <div className="answer-letter-outer">
                                    <span className="answer-letter-inner">{alphabet[index]}</span>
                                </div>
                                <div className="answer-text"><Latex>{answer}</Latex></div>
                            </li>) }
                    </ul>
                    <button className="button-a" onClick={this.prevQuestion} disabled={this.state.question_index < 1}>Previous</button>
                    <button className="button-a" onClick={this.nextQuestion} >{(this.props.question_index + 1) < this.props.set_length ? 'Next' : 'Finish'}</button>
                </div>
            );
        }
    }
}

export default Question;