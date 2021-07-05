import React, { Component, PropTypes } from 'react';
// import Switch from "react-switch";
import SetDropdown from './set_dropdown.jsx'
import MathTextarea from './math_textarea.jsx'
import { IoClose, IoAddCircle } from "react-icons/io5";
import axios from 'axios';
import Latex from 'react-latex';
import RenderQuestionBody from '../render_question_body';
import { withRouter } from 'react-router-dom';

const maxAnswers = 8;

// This is the create question componenet
// It is solely the form that allows for question creation.

class CreateQuestion extends Component {
    // static propTypes = {
    //     className: PropTypes.string,
    // };

    constructor(props) {
        super(props);
        this.state = {
	      body: '',
	      mcq: true,
	      answers:[''],
          err: null
	    };
    }

    // Handles input change s
    onChange = e => {
        if (e.target.name.includes('create-question-answer')){ //If input is an answer
            let index = e.target.getAttribute('answerindex');
            let newAnswer = e.target.value;
            let newAnswers = [...this.state.answers];
            newAnswers[index] = newAnswer
            this.setState((state) => ({
                answers: newAnswers
            }));
        }else{
            this.setState({[e.target.name]: e.target.value});
        }
    }
    // Handles mcq switch
    onSwitch = checked => {
    	this.setState({mcq: checked});
    	this.setState({answers: ['']})
    }
    // Handles adding and removing questions
    onAnswerChange = (isPlus, index) => {
    	if(isPlus){ //If + button
            this.setState((state) => ({
                answers: [...state.answers, '']
            }));
    	}else{ //If - button
            let newAnswers = [...this.state.answers]
            newAnswers.splice(index,1);
            this.setState(() => ({
                answers: newAnswers
            }));
    	}
    }

    onSubmit = e => {
    	e.preventDefault();

        axios.post(`/api/tutors/questions/${this.props.set_id}/`, {
            body: this.state.body,
            answers: this.state.answers,
            mcq: this.state.mcq
        })
        .then(res => {
            window.location.replace(`/app/tutor/sets/${this.props.set_id}`);
            // this.props.loadMethod();
        })
        .catch(err => {
            this.setState({err: err.response?.data.err})
            console.log(err)
        });
    }

    render() {
        return (
            <form className="create-question-form">
              	<h1>Create Question</h1>
                <div className="err-cont">
                    <span className="err">{this.state.err}</span>
                </div>
                {/* <SetDropdown popupMethod={this.props.popupMethod} updateLoadSets={this.props.updateLoadSets}/> */}
            	<MathTextarea className="create-question-body" change={this.onChange} name='body'/>
            	{/* <Switch onChange={this.onSwitch} checked={this.state.mcq} /> */}
                {/*Renders MCQ*/}
            	{this.state.mcq && 
            		<div>
            			{/* Renders first answer*/}
            			<div className="create-question-answer-outer">
                            <input type="text" name="create-question-answer-0" className="create-question-answer first-answer" onChange={this.onChange} answerindex={0} autocomplete="off"/>
                        </div>

            			{/* Renders all answers but the first*/}
	            		{this.state.answers.slice(1).map((answer, index) => 
	            			<div key={index} className="create-question-answer-outer">
                                <a className="remove-answers close" name="remove-answers" answerindex={index+1} onClick={() => this.onAnswerChange(false,index+1)}><IoClose/></a>
	            				<input type="text" name={'create-question-answer' + (index+1)} value={this.state.answers[index+1]} answerindex={index+1} className="create-question-answer" onChange={this.onChange} autocomplete="off"/>
            				</div>)}

	            		{/* Creates + button and removes it when max answers is reached */}
	            		{this.state.answers.length < maxAnswers && 
		        		<a className="add-answer" name="addAnswer" onClick={() => this.onAnswerChange(true)}><IoAddCircle/></a>}
            		</div>
            	}
    			{/* Renders FRQ*/}
            	{!this.state.mcq &&
	            	<input type="text" name="create-question" className="create-question-frq" onChange={this.onChange}/>
            	}
                <div className="create-question-preview">
                    <RenderQuestionBody className="create-question-preview-body">
                        {this.state.body}
                    </RenderQuestionBody>
                    {this.state.answers.map((answer, index) => 
                        <div className="create-question-answer-preview"><Latex>{this.state.answers[index]}</Latex></div>
                    )}
                </div>
            	<input type="submit" className="button-a" onClick={this.onSubmit}/>
            </form>
        );
    }

}

export default withRouter(CreateQuestion);
