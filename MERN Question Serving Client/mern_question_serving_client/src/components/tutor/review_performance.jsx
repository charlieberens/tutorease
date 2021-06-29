import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class ReviewPerformance extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	loading: true,
        	questions: []
        }
    }

    componentDidMount = () => {
    	this.loadStudentAnswers().then(
    		this.setState({loading: false})
    	);
    }

    loadStudentAnswers = async () => {
    	try{
    		const res = await axios.get(`/api/tutors/set_answers/${this.props.set_id}/${this.props.match.params.student_id}`);
    		let embiggened_questions = [];
    		res.data.questions.forEach((question, index) => {
    			embiggened_questions.push({
    				responses: question.responses,
    				question: this.props.set.questions[index]
    			});
    		});
    		console.log({embiggened_questions})
    		this.setState({
    			questions: embiggened_questions
    		});
    	}catch(err){
    		console.log(err);
    	}
    }

    render() {
    	if(this.state.loading){
    		return(<div>Give us a sec</div>)
    	}else{
	        return (
	            <div>
	            	{this.state.questions.map((question, index) => (
			            <div className="tutor-rev-question">
			            	<span className="tutor-rev-question-index">{index+1}.</span>
			            	<p className="tutor-rev-question-body">{question.question.body}</p>
			            	<ul className='tutor-rev-answer-block'>
			            		{question.responses.map((response, index) => (
			            			<li key={index} className={`tutor-rev-answer ${index < (question.responses.length - 1) ? 'incorrect' : 'correct' }`}>
			        					<div className="tutor-rev-answer-text">{response}</div>
			    					</li>))}
			            	</ul>
			            </div>
	            	))}
	            </div>
	        );
    	}
    }
}

export default withRouter(ReviewPerformance);
