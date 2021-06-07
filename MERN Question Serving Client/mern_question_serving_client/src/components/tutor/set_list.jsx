import React, { Component } from 'react';
import { IoEllipsisVertical } from "react-icons/io5";
import axios from 'axios';
import SetListPopup from './set_list_popup'
import * as dayjs from 'dayjs'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// Set Dropdown

const maxItemLen = 25;

const tutor_id = '60b9708d0ace8e1c0c836b60';

const base_path = '/tutors/sets'

class SetList extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	sets: [
                {
                    title: "Title",
                    date: "2021-06-04T00:15:09.750+00:00",
                    _id: '60b971b99684d98b7c4ddf8e',
                    dateF: "Jan. 1, 2021",
                    popupOpen: false
                }
            ]
        }
        this.loadSets()
        // this.props.updateLoadSets(this.loadSets);
    }

    loadSets = () => {
        axios.get(`/api/tutors/sets/${tutor_id}`)
        .then(res => {
            const tempSets = res.data.sets.map(set => {
                set.dateF = dayjs(set.date).format('MMM. D, YYYY');
                return {...set, popupOpen: false}
            });
            this.setState({sets: tempSets}); 
        })
    }

    openPopup = () => {
		this.props.popupMethod(true, 0, {loadSets: this.loadSets})
    }

    controlSetPopup = (index, bool) => {
        const tempSets = this.state.sets
        tempSets[index].popupOpen = bool;
        this.setState({
            sets: tempSets
        });
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
    	}else{ // If Open Dropdown
	        return (
	            <div>
                    <h2>Sets</h2>
                    <div className="set-list-inner">
    	            	{this.state.sets.map((set, index) => 
    	            		<div key={set.id} className="set-list-item" index={index}>
                                <Link to={`${base_path}/${set.id}`} className="set-list-item-content">
                                    <h3 className="set-list-item-title">{this.truncate(set.title, maxItemLen)}</h3>
                                    <em className="set-list-item-date">{set.dateF}</em>
                                </Link>
                                <div className="set-list-item-controls">
                                    {set.popupOpen &&
                                        <SetListPopup popupControl={this.controlSetPopup} index={index}/>
                                    }
                                    <IoEllipsisVertical className="control-icon" onClick={this.controlSetPopup.bind(this,index, true)}/>
                                </div>
                            </div>
    	            	)}
                    </div>
	            </div>
	        );
    	}
    }
}

export default SetList;
