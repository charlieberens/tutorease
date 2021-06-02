import React, { Component, PropTypes } from 'react';
import Switch from "react-switch";
import SetList from './set_list.jsx'
import { IoClose } from "react-icons/io5";

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
	      answers:['']
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
    	alert('submitted')
    }

    render() {
        return (
            <form className="create-question-form">
              	<h1>Create Question</h1>
                <SetList popupMethod={this.props.popupMethod}/>
            	<textarea className="create-question-body" name="body" value={this.state.body} onChange={this.onChange}></textarea>
            	<Switch onChange={this.onSwitch} checked={this.state.mcq} />
                {/*Renders MCQ*/}
            	{this.state.mcq && 
            		<div>
            			{/* Renders first answer*/}
            			<div className="create-question-answer-outer"><input type="text" name="create-question-answer-0" className="create-question-answer first-answer" onChange={this.onChange} answerindex={0}/></div>

            			{/* Renders all answers but the first*/}
	            		{this.state.answers.slice(1).map((answer, index) => 
	            			<div key={index} className="create-question-answer-outer">
	            				<input type="text" name={'create-question-answer' + (index+1)} value={this.state.answers[index+1]} answerindex={index+1} className="create-question-answer" onChange={this.onChange}/>
	            				<a className="remove-answers close" name="remove-answers" answerindex={index+1} onClick={this.onAnswerChange.bind(this,false,index+1)}><IoClose/></a>
            				</div>)}

	            		{/* Creates + button and removes it when max answers is reached */}
	            		{this.state.answers.length < maxAnswers && 
		        		<a className="add-answers" name="addAnswers" onClick={this.onAnswerChange.bind(this, true)}>+</a>}
            		</div>
            	}
    			{/* Renders FRQ*/}
            	{!this.state.mcq &&
	            	<input type="text" name="create-question" className="create-question-frq" onChange={this.onChange}/>
            	}
            	<input type="submit" className="button-a"/>
            </form>
        );
    }

}

export default CreateQuestion;
