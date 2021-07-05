import React, { Component, PropTypes } from 'react';
import Latex from 'react-latex';

class RenderQuestionBody extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div>
                {this.props.children.split('\n').filter(section => section).map(textFragment => 
                	<p className={`${textFragment.includes('!!block') && 'math-block'}`}><Latex>{textFragment.replace('!!block', '')}</Latex></p>
            	)}
        	</div>
        );
    }
}

export default RenderQuestionBody;
