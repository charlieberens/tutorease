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
import Set from './set'
import '../../styles/TutorPanel.css'

const base_path = '/tutors'

class TutorPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
	      popupOpen: [
	        false //0, CreateSet
	      ],
	      loadSets: null
	    }
    };

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

    render() {
        return (
            <div>
            	<nav>
	           		<Link to={`${base_path}/students`}>Profile</Link>
	           		<Link to={`${base_path}/sets`}>Sets</Link>
            	</nav>
            	<div className="tutor-panel-main">
            		<div className="tutor-panel-inner">
		        		<Switch>
		        			<Route path={`${base_path}/sets/:id`}>
		    					<Set updateLoadSets={this.updateLoadSets}/>
		    				</Route>
		        			<Route path={`${base_path}/sets`}>
		    					<SetList updateLoadSets={this.updateLoadSets}/>
		    				</Route>
		    				<Route path={`${base_path}/students`}>
		    				    <CreateQuestion updateLoadSets={this.updateLoadSets}/>
							</Route>
		        		</Switch>
	        		</div>
        		</div>
            </div>
        );
    }
}

export default TutorPanel;

						 // <CreateQuestion popupMethod={this.controlPopup} updateLoadSets={this.updateLoadSets}/>
						 // {
						 // 	this.state.popupOpen[0] && 
						 // 	<Popup className="popup-cont" popupMethod={this.controlPopup}><CreateSet popupMethod={this.controlPopup} loadSets={this.state.loadSets}/></Popup>
						 // }
