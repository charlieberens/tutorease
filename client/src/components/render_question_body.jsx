import React, { Component } from "react";
import Latex from "react-latex";

class RenderQuestionBody extends Component {
    render() {
        return (
            <div className={this.props.className}>
                {this.props.children
                    .split("\n")
                    .filter((section) => section)
                    .map((textFragment) => (
                        <p
                            className={`${
                                textFragment.includes("!!block") && "math-block"
                            }`}
                        >
                            <Latex>{textFragment.replace("!!block", "")}</Latex>
                        </p>
                    ))}
            </div>
        );
    }
}

export default RenderQuestionBody;
