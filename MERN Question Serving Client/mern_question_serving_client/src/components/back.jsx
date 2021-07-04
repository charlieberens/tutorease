import React, { Component, PropTypes } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { withRouter } from 'react-router-dom';

class Back extends Component {
    constructor(props) {
        super(props);
    }

    clickHandler = () => {
    	if(this.props.to){
            window.location.replace(this.props.to);
    	}else{
			this.props.history.goBack()
		}
    }

    render() {
        return (
            <a onClick={this.clickHandler} className="back-link"><IoArrowBack/>{this.props.text ? this.props.text : 'Go back'}</a>
        );
    }
}

export default withRouter(Back);
