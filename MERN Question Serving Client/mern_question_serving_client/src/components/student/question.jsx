import React, { Component, PropTypes } from 'react';

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	body: "Lorem ipsum dolor sit amet dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        	answers: ['7 Red 1 Blue', '4 Red 4 Blue', '7 Blue 1 Red', '8 Blue']
        }
    }

    render() {
        return (
            <div className="question">
            	<p className="question-body">{this.state.body}</p>
            	<ul className="answer-block">
            		{ this.state.answers.map((answer, index) => 
            			<li key={index} className="answer">
            				<div className="answer-letter-outer">
            					<span className="answer-letter-inner">{alphabet[index]}</span>
        					</div>
        					<div className="answer-text">{answer}</div>
    					</li>) }
            	</ul>
            </div>
        );
    }
}

export default Question;