import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import * as dayjs from 'dayjs';
import '../../styles/Profile.css'
import { IoPencil } from "react-icons/io5";
import Linkify from 'react-linkify';

class Profile extends Component {
    constructor(props) {
        super(props);

	    this.state = {
	    	loading: true,
            err: null,
            isCurrentUser: false
	    }
    }

    componentDidMount(){
        this.loadPage()
    }

    componentDidUpdate (prevProps) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.loadPage();
        }
    }

    loadPage = async () => {
        this.setState({loading: true, err: null})
        await this.loadUser();
        this.setState({loading: false})
    }

    loadUser = async () => {
    	const res = await axios.get(`/api/users/profile/${this.props.match.params.username}`);
        if(!res.data.err){
    		if(res.data.isCurrentUser){
                this.setState({isCurrentUser: true})
    		}
    		this.setState({
    			user: {
                    id: res.data.id,
    				profileIcon: res.data.profileIcon,
    				displayName: res.data.displayName,
    				bio: res.data.bio,
    				tutor: res.data.tutor,
    				student: res.data.student,
                    startDate: dayjs(res.data.startDate).format('MMM. D, YYYY'),
                    pendingStudent: res.data.pendingStudent,
                    currentStudent: res.data.currentStudent,
                    username: this.props.match.params.username
    			}
    		})
        }else{
            this.setState({err: res.data.err})
        }
    }

    inviteStudent = () => {
        axios.post(`/api/students/invite/${this.state.user.id}`).then(res => {
            this.loadPage();
        })
    }

    render() {
    	if(this.state.loading){
    		return(
    			<div>
    				Loading
    			</div>
    		)
    	}else if(this.state.err){
            return(
                <div className="profile">
                    {this.state.err}
                </div>
            )
        }else if(this.state.isCurrentUser){
    		return(
				<div className="profile-cont">
                    <div className="profile-inner">
                        <Link to="/app/setup" className="edit-profile-icon-outer">
                            <IoPencil className="edit-profile-icon"/>
                        </Link>
                        <div className="profile-top">
                            <img className="profile-icon" src={this.state.user.profileIcon} />
                            <h2 className="profile-display-name">{this.state.user.displayName}</h2>
                            <span className="profile-username">@{this.state.user.username}</span>
                        </div>
                        <div className="profile-bio">
                            <p className="linkify"><Linkify>{this.state.user.bio ? this.state.user.bio : <><em>{this.state.user.displayName} is bioless. This is truly unfortunate</em> 🙁</>}</Linkify></p>
                        </div>
                    </div>
    			</div>
    		)
    	}else{
            return(
                <div className="profile-cont">
                    <div className="profile-inner">
                        <div className="profile-top">
                            <img className="profile-icon" src={this.state.user.profileIcon} />
                            <h2 className="profile-display-name">{this.state.user.displayName}</h2>
                            <span className="profile-username">@{this.state.user.username}</span>
                        </div>
                        <div className="profile-bio">
                            <p className="linkify"><Linkify>{this.state.user.bio ? this.state.user.bio : <><em>{this.state.user.displayName} is bioless. This is truly unfortunate</em> 🙁</>}</Linkify></p>
                        </div>
                        {this.state.user.student &&
                            <div className="profile-bottom">
                                {this.state.user.pendingStudent ? 
                                    <em>{this.state.user.displayName} hasn't accepted your request yet</em>
                                :
                                    (this.state.user.currentStudent ? 
                                        <div>
                                            <em>{this.state.user.displayName} is your student!</em><br/>
                                            <Link className="grey-a" to={`/profile/${this.state.user.username}/performance`}>View progress</Link>
                                        </div>
                                    :
                                        <div>
                                            <a className="grey-a" onClick={this.inviteStudent}>Invite {this.state.user.displayName}</a>
                                        </div>
                                    )
                            }
                            </div>
                        }
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(Profile);
