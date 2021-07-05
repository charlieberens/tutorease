import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Latex from 'react-latex';
import RenderQuestionBody from '../render_question_body';

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
    	console.log(this.props.match.params)
    	try{
    		const res = await axios.get(`/api/tutors/set_answers/${this.props.match.params.set_id}/${this.props.match.params.student_username}`);
    		this.setState({
    			questions: res.data.embiggened_questions
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
			            	<RenderQuestionBody className="tutor-rev-question-body">
								{question.question.body}
			            	</RenderQuestionBody>
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
