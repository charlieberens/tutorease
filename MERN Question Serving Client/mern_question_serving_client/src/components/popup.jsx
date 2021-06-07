import React, { Component, PropTypes } from 'react';
import { IoClose } from "react-icons/io5";

class Popup extends Component {
    constructor(props) {
        super(props);
    }

    closePopup = () => {
    	this.props.popupMethod(false)
    }

    render() {
		return (
		    <div className="popup-cont">
		    	<div className="popup">
			    	<div className="popup-inner">
			    		<div className="popup-close close" onClick={this.closePopup}><IoClose/></div>
			    		{this.props.children}
			    	</div>
		    	</div>
		        <div className="popup-close-capture" onClick={this.closePopup}></div>
		    </div>
		);
    }
}

export default Popup;
