import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import React, { Component, PropTypes } from 'react';
import CreateQuestion from './create_question'
import CreateSet from './create_set'
import Popup from '../popup'
import SetList from './set_list'
import StudentList from './student_list'
import Set from './set'
import AddStudent from './add_student'
import AssignSet from './assign_set'
import '../../styles/TutorPanel.css'
import axios from 'axios'
const base_path = '/app/tutor'

class TutorPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
	      popupOpen: [
	        false //0, CreateSet
	      ],
	      loadSets: null,
	      tutorDeets: null
	    }
    };

    componentDidMount = () => {
    	this.loadTutor();
    }

	controlPopup = (open, popupIndex) => { //Open argument = true for opening and false for closin
		const tempPopup = this.state.popupOpen.splice()
		tempPopup[popupIndex] = open;

		this.setState( state => ({
		  popupOpen: tempPopup
		}));
	}

	updateLoadSets = (method) => {
		this.setState({
		  loadSets: method
		});
	}

	loadTutor = () => {
		axios.get('/api/tutors').then(res => {
			this.setState({tutorDeets: res.data})
		})
	}

    render() {
    	if(this.state.tutorDeets){
	        return (
	            <div>
	            	<div className="tutor-panel-outer">
	            		<div className="tutor-panel-inner">
			        		<Switch>
			        			<Route path={`${base_path}/sets/assign/:id`}>
			    					<AssignSet/>
			    				</Route>
			        			<Route path={`${base_path}/sets/:id`}>
			    					<Set updateLoadSets={this.updateLoadSets}/>
			    				</Route>
			        			<Route path={`${base_path}/add-student`}>
			    					<AddStudent tutorDeets={this.state.tutorDeets}/>
			    				</Route>
			    				<Route path={base_path}>
			    					<div className="tutor-panel-main">
				    					<div className="tutor-panel-left">
				    						<SetList/>
				    					</div>
				    					<div className="tutor-panel-right">
				    						<h2>Students</h2>
				    						<StudentList tutorDeets={this.state.tutorDeets}/>
				    					</div>
			    					</div>
			    				</Route>
			        		</Switch>
		        		</div>
	        		</div>
	            </div>
	        );
    	}else{
    		return(
    			<em>Give us a second</em>
    		)
    	}
    }
}

export default TutorPanel;