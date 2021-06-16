import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import Popup from '../popup';
import QuestionPopup from './question_popup'
import CreateQuestion from './create_question';
import DeleteQuestion from './delete_question';
import { IoEllipsisVertical, IoAddCircle } from "react-icons/io5";

const tutor_id = '60b9708d0ace8e1c0c836b60';

class Set extends Component {
    constructor(props) {
        super(props);

        this.state = {
      		questions: [],
      		popupOpen: false,
      		createQuestionPopupOpen: false,
      		deleteQuestionPopupOpen: false,
      		deleteQuestion: undefined
    	}

    	this.loadSet();
    }
    
    loadSet = () => {
    	axios.get(`/api/tutors/set/${tutor_id}/${this.props.match.params.id}`)
        .then(res => {
        	const tempQuestions = res.data.questions.map(question => {
        		return {...question, popupOpen: false}
        	});
            this.setState({
            	title: res.data.title,
            	date: res.data.date,
            	id: res.data.id,
            	questions: tempQuestions
            });
        }).catch(err => {
        	console.log(err);
        });
    }

    controlCreateQuestionPopup = bool => {
    	this.setState({
    		popupOpen: bool
    	})
    }

    controlQuestionPopup = (index, bool) => {
    	const tempQuestions = this.state.questions;
    	tempQuestions[index].popupOpen = bool;
    	this.setState({questions: tempQuestions});
    }

    deleteQuestion = (question) => {
    	this.setState({deleteQuestion: question});
    	this.controlDeleteQuestionPopup(true);
    }

    controlDeleteQuestionPopup = bool => {
    	this.setState({deleteQuestionPopupOpen: bool})
    }

    render() {
		return (
			<>
				<div>
					<h1>{this.state.title}</h1>
					{!this.state.questions.length ?
						(<div className="no-questions-cont">
							<p>This set doesn't have any questions. <a className="inline-a" onClick={() => this.controlCreateQuestionPopup(true)}>Make one</a>?</p>
				    	</div>)
					:
						(<div className="question-list">
							{this.state.questions.map((question, index) => 
								<div className="question-list-item">
									<span className="question-list-item-number">{index+1}</span>
									<span className="question-list-item-dots" onClick={() => this.controlQuestionPopup(index, true)}>
										<IoEllipsisVertical/>
										{question.popupOpen &&
                                        	<QuestionPopup popupControl={this.controlQuestionPopup} index={index} deleteQuestion={() => this.deleteQuestion({index: index, question_id: question.id, set_id: this.state.id})}/>
										}
									</span>
									<p className="question-list-item-body">{question.body}</p>
									<div className="question-list-item-answer-cont">
									{question.answers.map((answer, i) => 
										<div className={`question-list-item-answer ${i === 0 ? 'question-list-item-answer-right': 'question-list-item-answer-wrong'}`} >
											<span className="question-list-item-answer-text">{answer}</span>
										</div>
									)}
									</div>
								</div>
							)}
							<div className="question-list-create" onClick={() => this.controlCreateQuestionPopup(true)}>
								<IoAddCircle className="question-list-create-plus"/><span>Create Question</span>
							</div>
						</div>)
					}
				</div>
				{this.state.popupOpen && //Create Question Popup
					<Popup popupMethod={this.controlCreateQuestionPopup}><CreateQuestion set_id={this.props.match.params.id} popupMethod={this.controlCreateQuestionPopup} loadMethod={this.loadSet}/></Popup>
				}
			    {this.state.deleteQuestionPopupOpen &&
                    <Popup popupMethod={this.controlDeleteQuestionPopup}><DeleteQuestion popupMethod={this.controlDeleteQuestionPopup} loadQuestions={this.loadSet} question={this.state.deleteQuestion}/></Popup>
                }
			</>
		);
    }
}

export default withRouter(Set);
