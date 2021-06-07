import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import Popup from '../popup';
import CreateQuestion from './create_question';

const tutor_id = '60b9708d0ace8e1c0c836b60';

class Set extends Component {
    constructor(props) {
        super(props);

        this.state = {
      		questions: [],
      		popupOpen: false
    	}
    }

    componentDidMount() {
        // this.loadSet(set_id);
    }
    
    loadSet = set_id => {
    	axios.get(`/api/tutors/set/${tutor_id}/${set_id}`)
        .then(res => {
            this.setState(res.data.set);
        }).catch(err => {
        	console.log(err);
        });
    }

    controlPopup = bool => {
    	this.setState({
    		popupOpen: bool
    	})
    }

    render() {
        const set_id = this.props.match.params.id;
	    axios.get(`/api/tutors/set/${tutor_id}/${set_id}`)
        .then(res => {
            this.setState(res.data.set);
            return (
				<>
					{this.state.questions != [] &&
						(<div>
							<h2>{this.state.title}</h2>
							<p>This set doesn't have any questions. <a onClick={this.controlPopup(true)}>Make one?</a></p>
				    	</div>)
					}
					{true &&
						(<div className="question-list">
							{this.state.questions.map((question, index) => 
								<div className="question-list-question question-list-item">
									{question.body}
								</div>
							)}
						</div>)
					}
					
					{this.state.popupOpen &&
						<Popup popupMethod={this.controlPopup}><CreateQuestion set_id={this.props.match.params.id} popupMethod={this.controlPopup}/></Popup>
					}
				</>
			);
        }).catch(err => {
        	console.log(err);
        });
    }
}

export default withRouter(Set);
