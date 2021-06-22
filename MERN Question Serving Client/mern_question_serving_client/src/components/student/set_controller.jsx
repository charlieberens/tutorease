import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import {match, withRouter} from 'react-router-dom';
import SetGame from './set_game'

class SetController extends Component {
    constructor(props) {
        super(props);
    	this.state = {
    		completed: true,
    		numAnswered: 0,
    		set: {
    			id: undefined,
    			title: '',
    			questions: [],
    			description: '',
    			date: ''
    		}
    	}
    }

    componentDidMount = () => {
    	this.checkSetType();
    }

    checkSetType = () => {
    	const re = /(?<=\/)[\dA-Za-z]+($|(?=(\?|\#)))/g;
    	axios.get(`/api/students/set/${window.location.href.match(re)[0]}`).then(res => {
    		this.setState({
    			completed: res.data.completed,
    			numAnswered: res.data.numAnswered,
    			tutor: {
					icon: res.data.tutorIcon,
					name: res.data.tutorName,
					username: res.data.tutorUsername						
    			},
    			set: {
	    			id: res.data.id,
	    			title: res.data.title,
	    			questions: res.data.questions,
	    			description: res.data.description,
	    			date: res.data.date,
	    			length: res.data.questions.length
    			}
    		})
    	}).catch(err => {
    		console.log(err);
    	})
    }

    render() {
    	if(this.state.completed){
	        return (
	            <div>
	            	Completed
	            </div>
	        );
    	}else{
			console.log('this.state', this.state);
    		return (
    			<div className="set-game-cont">
					<SetGame set={this.state}/>
    			</div>
    		);
    	}
    }
}

export default withRouter(SetController);
