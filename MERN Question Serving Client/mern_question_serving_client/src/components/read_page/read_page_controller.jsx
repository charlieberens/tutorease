import React, { Component, PropTypes } from 'react';
import LatexPage from './latex_page';
import Feedback from './feedback';
import Footer from '../footer';
import { Route, Switch } from 'react-router-dom';

class ReadPageController extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<>
	        	<div className="read-page trad-cont">
		        	<div className="read-page-inner">
			            <Switch>
			            	<Route path="/LaTeX"><LatexPage/></Route>
			            </Switch>
			            <Switch>
			            	<Route path="/feedback"><Feedback/></Route>
			            </Switch>
		        	</div>
				</div>
	            <Footer/>
        	</>
        );
    }
}

export default ReadPageController;
