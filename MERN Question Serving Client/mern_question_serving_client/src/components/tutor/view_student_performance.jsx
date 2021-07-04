import React, { Component, PropTypes } from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import ReviewPerformance from './review_performance';

class ViewStudentPerformance extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	authorized: false
        }
    }

    componentDidMount = () => {
    	this.loadStudent();
    }

    loadStudent = async () => {
    	const res = await axios.get(`/api/tutors/get-student-performance/sets/${this.props.match.params.student_username}`);
    	if(res.data.noAuth){
    		this.setState({authorized: false});
    	}else{
    		this.setState({
    			displayName: res.data.displayName,
    			username: this.props.match.params.student,
    			profileIcon: res.data.profileIcon,
    			sets: res.data.sets.sort((a, b) => new Date(a.completeDate ? a.completeDate : '2500-07-20') - new Date(b.completeDate ? b.completeDate : '2500-07-20')),
                authorized: true
    		})
    	}
    }

    render() {
    	if(this.state.authorized){
	        return (
                <Switch>
                    <Route path="/app/profile/:student_username/performance/:set_id">
                        <ReviewPerformance/>
                    </Route>
                    <Route path="/app/profile/:student_username/performance">
                        <div className="view-student-performance-cont">
                            {this.state.sets.map((set,index) => 
                                <div>
                                    <div className="set-performance-student-left">
                                        <div className="set-performance-student-left-right">
                                            <h3>{set.title}</h3>
                                        </div>
                                    </div>
                                    <div className="set-performance-student-bar"></div>
                                    {set.completeDate ? 
                                        <div className="set-performance-student-right completed">
                                            <div className="set-performance-student-right-top">
                                                <span>{set.numCorrect}</span> out of <span>{set.setLength}</span>
                                            </div>
                                            <div className="set-performance-student-right-bottom">
                                                <Link className="grey-a" to={`/app/profile/${this.props.match.params.student_username}/performance/${set.id}`}>Details</Link>
                                            </div>
                                        </div>
                                        :
                                        <div className="set-performance-student-right">Not Completed</div>
                                    }
                                </div>
                            )}
                        </div>
                    </Route>
                </Switch>
	        );
    	}else{
    		return(
    			<div><em>@{this.props.match.params.student_username} is not your student</em></div>
    		);
    	}
    }
}

export default withRouter(ViewStudentPerformance);
