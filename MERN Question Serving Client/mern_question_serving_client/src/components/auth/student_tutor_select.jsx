import React, { Component, PropTypes } from 'react';
import {IoSchool, IoSchoolOutline} from 'react-icons/io5';
import axios from 'axios';

import '../../styles/Auth.css'

import { withRouter } from "react-router-dom";

class StudentTutorSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
    		studentSelected: false,
    		tutorSelected: false
        }
    }

    flipSelect = student => {
    	if(student){
    		this.setState(state => ({
    			studentSelected: !state.studentSelected
    		}));
    	}else{
    		this.setState(state => ({
    			tutorSelected: !state.tutorSelected
    		}));
    	}
    }

    sendRoleSelect = e => {
    	e.preventDefault();

    	axios.post('/api/users/roles/', {
    		tutor: this.state.tutorSelected,
    		student: this.state.studentSelected
    	}).then(res => {
			this.props.history.push("/app/profile");
    	}).catch(err => {
    		console.log(err);
    	});
    }

    render() {
        return (
        	<form className="tutor-student-select-outer">
        		<h1>What are you?</h1>
				<div className="tutor-student-select-inner">
					<div className={`tutor-student-item ${this.state.studentSelected && 'selected'}`} onClick={() => this.flipSelect(true)}>
						<div className="tutor-student-item-top">
							{!this.state.studentSelected ? <IoSchoolOutline/> : <IoSchool/>}
						</div>
						<h2>Student</h2>
					</div>
					<div className={`tutor-student-item ${this.state.tutorSelected && 'selected'}`} onClick={() => this.flipSelect(false)}>
						<div className="tutor-student-item-top">
							{!this.state.tutorSelected ? <IoSchoolOutline/> : <IoSchool/>}
						</div>
						<h2>Teacher/Tutor</h2>
					</div>
				</div>
				<button className='tutor-student-button button-a' disabled={!(this.state.studentSelected || this.state.tutorSelected)} onClick={this.sendRoleSelect}>Continue</button>
			</form>
        );
    }
}

export default withRouter(StudentTutorSelect);
