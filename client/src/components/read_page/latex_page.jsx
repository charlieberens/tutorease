import React, { Component } from "react";
import Latex from "react-latex";

class LatexPage extends Component {
    render() {
        return (
            <>
                <h1>Writing equations and styling text with LaTeX</h1>
                <p>
                    <Latex>
                        Want to write equations? Want to write words with
                        $emphasis$? You're in the right place.
                    </Latex>
                </p>
                <br />
                <br />
                <p>
                    This app supports latex. To write an inline equation,
                    surround your code with $'s.
                </p>
                <div className="LaTeX-section">
                    <p>
                        I'm a big fan of the equation{" "}
                        <code>$a^2 + b^2 = c^2$</code>
                    </p>
                </div>
                <p className="LaTeX-becomes">Becomes</p>
                <div className="LaTeX-section LaTeX-section-LaTeXed">
                    <p>
                        <Latex>
                            I'm a big fan of the expression $a^2 + b^2 = c^2$
                        </Latex>
                    </p>
                </div>
                <br />
                <br />
                <p>To write a block equation surround your code with $$</p>
                <div className="LaTeX-section">
                    <p>
                        Block equations are centered and on a seperate line.{" "}
                        <code>$$V = \\pi^2$$</code> Like this one.
                    </p>
                </div>
                <p className="LaTeX-becomes">Becomes</p>
                <div className="LaTeX-section LaTeX-section-LaTeXed">
                    <p>Block equations are centered and on a seperate line.</p>
                    <p className="math-block">
                        <Latex>$$V = \\pi^2$$</Latex>
                    </p>
                    <p>Like this one.</p>
                </div>
                <br />
                <br />
                <p>
                    Want to just type a $? Due to the limitations of Katex, the
                    best solution is to write \$ inside of an equation.
                </p>
                <div className="LaTeX-section">
                    <p>
                        I owe this dude <code>$\$5$</code>.
                    </p>
                </div>
                <p className="LaTeX-becomes">Becomes</p>
                <div className="LaTeX-section LaTeX-section-LaTeXed">
                    <p>
                        <Latex>I owe this dude $\$5$.</Latex>
                    </p>
                </div>
                <br />
                <br />
                <p>
                    Want to learn more?{" "}
                    <a
                        href="https://katex.org/docs/supported.html"
                        className="primary-a"
                    >
                        Click Here
                    </a>
                </p>
            </>
        );
    }
}

export default LatexPage;
