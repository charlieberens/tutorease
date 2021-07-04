import React, { Component, PropTypes } from 'react';
import '../../styles/latex.css';
import Latex from 'react-latex';

class MathTextarea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            formattedValue: ''
        }

        this.start_symbol = '$';
    }

    componentDidMount = () => {
        this.setState({value: this.props.value})
    }

    onChange = e => {
        this.setState({value: e.target.value, formattedValue: this.addLinebreaks(e.target.value)});

        this.props.change({target: {value: this.state.formattedValue, name: this.props.name}});
    }

    addLinebreaks = str => { //Adds linebreaks before block functions
        const split_str = str.split(this.start_symbol + this.start_symbol);
        let output_arr = [];
        split_str.forEach((section, index) => {
            let modified_section = section;
            if(index % 2 == 0){
                if(index < split_str.length - 2){
                    modified_section = modified_section + '\n'
                }
                if(index != 0 && index != split_str.length - 2){
                    modified_section = '\n' + modified_section
                }
            }
            output_arr.push(modified_section);
        });
        return(output_arr.join(this.start_symbol + this.start_symbol));
    }

    render() {
        return (
            <div className="math-textarea-outer">
                <textarea className="math-textarea" onChange={this.onChange} value={this.props.start_value}></textarea>
                <div className="math-textarea-preview">
                    {this.state.formattedValue.split('\n').filter(section => section).map(textFragment => 
                        <p><Latex>{textFragment}</Latex></p>
                    )}
                </div>
            </div>
        );
    }
}

export default MathTextarea;
