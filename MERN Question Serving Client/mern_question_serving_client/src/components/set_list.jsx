import React, { Component, PropTypes } from 'react';
import { IoChevronDown, IoAddCircle } from "react-icons/io5";
import CreateSet from './create_set.jsx'
// Set Dropdown

const maxItemLen = 25;

class SetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	sets: ['PSet 1', 'PSet 2', 'This is long, very long, tghe slongest', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        	chosenIndex: null,
        	open: false
        }
    }

    toggleDrop = () => {
    	if(this.state.open){
    		document.getElementsByClassName('set-list-scroll-fix')[0].scrollTop = 0;
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

    openPopup = innerComponent => {
		this.props.popupMethod(true, <CreateSet/>)
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
	            <div className="set-list set-list-open">
	            	<div className="set-list-scroll-fix">
		            	{this.state.sets.map((set, index) => 
		            		<div key={'set' + index} className="set-list-item set-list-item-trad" index={index} onClick={this.changeSet.bind(this, index)}><span>{this.truncate(set, maxItemLen)}</span></div>
		            	)}
		            	<div className="set-list-create set-list-item" onClick={this.openPopup.bind(this, <CreateSet />, true)}>
		            		<span>Create a new set</span><IoAddCircle className="set-list-create-plus"/>
		            	</div>
	            	</div>
	            </div>
	        );
    	}else{ // If Unopened Dropdown
    		return (
    			<div className="set-list set-list-closed" onClick={this.toggleDrop}>
    				<div className="set-list-dropdown-top set-list-item">
    					{this.state.chosenIndex != null ? /*Either names the chosen set or says Choose a Set*/
						<span className="set-list-chosen">{this.truncate(this.state.sets[this.state.chosenIndex], maxItemLen)}</span> : 
						<span className="set-list-choose">Choose a set</span>}
    					<span className="set-list-dropdown-caret"><IoChevronDown/></span>
    				</div>
    			</div>
    		);
    	}
    }
}

export default SetList;
