import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import * as dayjs from 'dayjs'

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
    				profileIcon: res.data.profileIcon,
    				displayName: res.data.displayName,
    				bio: res.data.bio,
    				tutor: res.data.tutor,
    				student: res.data.student,
                    startDate: dayjs(res.data.startDate).format('MMM. D, YYYY'),
                    username: this.props.match.params.username
    			}
    		})
        }else{
            this.setState({err: res.data.err})
        }
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
                        <div className="profile-top">
                            <img src={this.state.user.profileIcon} />
                            <h2 className="profile-display-name">{this.state.user.displayName}</h2>
                            <span className="profile-username">@{this.state.user.username}</span>
                        </div>

                    </div>
    			</div>
    		)
    	}else{
            return(
                <div>
                    {this.state.user.displayName}eee
                    @{this.state.user.username}
                </div>
            )
        }
    }
}

export default withRouter(Profile);
