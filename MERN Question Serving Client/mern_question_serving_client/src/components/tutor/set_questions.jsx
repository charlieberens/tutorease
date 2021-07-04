import React, { Component, PropTypes } from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios';
import Popup from '../popup';
import QuestionPopup from './question_popup'
import CreateQuestion from './create_question';
import DeleteQuestion from './delete_question';
import AssignSet from './assign_set'
import { IoEllipsisVertical, IoAddCircle } from "react-icons/io5";
import Latex from 'react-latex';

class SetQuestions extends Component {
    constructor(props) {
        super(props);

        this.state = {
      		deleteQuestionPopupOpen: false,
      		assignQuestionPopupOpen: false,
      		deleteQuestion: undefined
    	}
    }
    
    controlQuestionPopup = (index, bool) => {
    	const tempQuestions = this.props.questions;
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
    controlAssignQuestionPopup = bool => {
    	this.setState({assignQuestionPopupOpen: bool})
    }

    render() {
		return (
			<Switch>
				<Route path={`/app/tutor/sets/${this.props.id}/create-question`}>
					<CreateQuestion set_id={this.props.id} loadMethod={this.props.loadSet}/>
				</Route>
				<Route path={`/app/tutor/sets/${this.props.id}`}>				
					<div>
						{!this.props.questions?.length ?
							(<div className="no-questions-cont">
								<p>This set doesn't have any questions. <Link className="inline-a" to={`/app/tutor/sets/${this.props.id}/create-question`}>Make one</Link>?</p>
					    	</div>)
						:
							(<div className="question-list">
								{this.props.questions.map((question, index) => 
									<div className="question-list-item">
										<span className="question-list-item-number">{index+1}</span>
										<span className="question-list-item-dots" onClick={() => this.controlQuestionPopup(index, true)}>
											<IoEllipsisVertical/>
											{question.popupOpen &&
	                                        	<QuestionPopup popupControl={this.controlQuestionPopup} index={index} deleteQuestion={() => this.deleteQuestion({index: index, question_id: question.id, set_id: this.state.id})}/>
											}
										</span>
										<div className="question-list-item-body">
											{question.body.split('\n').filter(section => section).map(textFragment => 
                        						<p><Latex>{textFragment}</Latex></p>
                    						)}
										</div>
										<div className="question-list-item-answer-cont">
										{question.answers.map((answer, i) => 
											<div className={`question-list-item-answer ${i === 0 ? 'question-list-item-answer-right': 'question-list-item-answer-wrong'}`} >
												<span className="question-list-item-answer-text"><Latex>{answer}</Latex></span>
											</div>
										)}
										</div>
									</div>
								)}
								<Link className="question-list-create" to={`/app/tutor/sets/${this.props.id}/create-question`}>
									<IoAddCircle className="question-list-create-plus"/><span>Create Question</span>
								</Link>
							</div>)
						}
					</div>
				    {this.state.deleteQuestionPopupOpen &&
	                    <Popup popupMethod={this.controlDeleteQuestionPopup}><DeleteQuestion popupMethod={this.controlDeleteQuestionPopup} loadQuestions={this.props.loadSet} question={this.state.deleteQuestion} set_id={this.props.id}/></Popup>
	                }
				</Route>
			</Switch>
		);
    }
}

export default withRouter(SetQuestions);
