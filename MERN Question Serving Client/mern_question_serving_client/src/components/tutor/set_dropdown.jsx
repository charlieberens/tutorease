import React, { Component } from 'react';
import { IoChevronDown, IoAddCircle } from "react-icons/io5";
import axios from 'axios';
// Set Dropdown

const maxItemLen = 25;

const tutorID = '60b9708d0ace8e1c0c836b60';

class SetDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	sets: [],
        	chosenIndex: null,
        	open: false
        }
        this.loadSets()
        this.props.updateLoadSets(this.loadSets);
    }

    loadSets = () => {
        axios.get(`/api/tutors/sets/${tutorID}`)
        .then(res => {
            this.setState({sets: res.data.sets}); 
        })
    }

    toggleDrop = () => {
    	if(this.state.open){
    		document.getElementsByClassName('dropdown-set-list-scroll-fix')[0].scrollTop = 0;
    	}
    	this.setState(state => ({
    		open: !state.open
    	}));
    }

    changeSet = (index) => {
    	this.setState(state => ({
    		chosenIndex: index
    	}));
    	this.toggleDrop();
    }

    openPopup = () => {
		this.props.popupMethod(true, 0, {loadSets: this.loadSets})
    }

    truncate = (text, length) => {
        if(text.length < length){
            return text
        }else{
            return text.slice(0, length).trim() + '...'
        }
    }

    render() {    
    	if(!this.state.sets){ //If there aren't any sets
    		return <div></div>
    	}else if(this.state.open){ // If Open Dropdown
	        return (
	            <div className="dropdown-set-list dropdown-set-list-open">
	            	<div className="dropdown-set-list-scroll-fix">
		            	{this.state.sets.map((set, index) => 
		            		<div key={'set' + index} className="dropdown-set-list-item dropdown-set-list-item-trad" index={index} onClick={() => this.changeSet(index)}><span>{this.truncate(set, maxItemLen)}</span></div>
		            	)}
		            	<div className="dropdown-set-list-create dropdown-set-list-item" onClick={this.openPopup}>
		            		<span>Create a new set</span><IoAddCircle className="dropdown-set-list-create-plus"/>
		            	</div>
	            	</div>
	            </div>
	        );
    	}else{ // If Unopened Dropdown
    		return (
    			<div className="dropdown-set-list dropdown-set-list-closed" onClick={this.toggleDrop}>
    				<div className="dropdown-set-list-dropdown-top dropdown-set-list-item">
    					{this.state.chosenIndex != null ? /*Either names the chosen set or says Choose a Set*/
						<span className="dropdown-set-list-chosen">{this.truncate(this.state.sets[this.state.chosenIndex], maxItemLen)}</span> : 
						<span className="dropdown-set-list-choose">Choose a set</span>}
    					<span className="dropdown-set-list-dropdown-caret"><IoChevronDown/></span>
    				</div>
    			</div>
    		);
    	}
    }
}

export default SetDropdown;
