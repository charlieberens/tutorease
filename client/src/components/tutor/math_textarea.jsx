import React, { Component } from "react";
import "../../styles/latex.css";

class MathTextarea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            formattedValue: "",
        };

        this.start_symbol = "$";
    }

    componentDidMount = () => {
        this.setState({ value: this.props.value });
    };

    onChange = (e) => {
        const val = this.addLinebreaks(e.target.value);
        this.setState({ value: e.target.value, formattedValue: val });

        this.props.change({ target: { value: val, name: this.props.name } });
    };

    addLinebreaks = (str) => {
        //Adds linebreaks before block functions
        const split_str = str.split(this.start_symbol + this.start_symbol);
        let output_arr = [];
        split_str.forEach((section, index) => {
            let modified_section = section;
            if (index % 2 === 0) {
                if (index < split_str.length - 2) {
                    modified_section = modified_section + "\n";
                }
                if (index !== 0 && index !== split_str.length - 2) {
                    modified_section = "\n" + modified_section;
                }
            } else {
                modified_section = "!!block" + modified_section;
            }
            output_arr.push(modified_section);
        });
        return output_arr.join(this.start_symbol + this.start_symbol);
    };

    render() {
        return (
            <div className="math-textarea-outer">
                <textarea
                    className="math-textarea"
                    onChange={this.onChange}
                    value={this.props.start_value}
                ></textarea>
            </div>
        );
    }
}

export default MathTextarea;
