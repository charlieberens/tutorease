import React, { Component, PropTypes } from 'react';

class LatexPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="read-page">
            	<div className="read-page-inner">
            		<h1>Writing equations and styling text with LaTeX</h1>
            		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non leo sem. In ut nunc fringilla, tristique velit non, egestas eros. Nunc ut tellus eros. Morbi ac erat nunc. Aliquam lobortis tristique elit, ac suscipit sem.</p>
            		<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas auctor faucibus nulla, non commodo quam accumsan at. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean nec porttitor nisl, in finibus augue. Nulla pulvinar massa ligula, in sollicitudin arcu feugiat vel.em.</p>
            		<p>Phasellus tincidunt, ex vel interdum blandit, tortor eros hendrerit dui, nec luctus nulla tellus vel ante. Suspendisse vehicula, mauris faucibus ullamcorper faucibus, mi justo aliquet massa, a molestie tortor nulla vel justo. Fusce venenatis quam ligula, quis volutpat elit pretium eu.</p>
            	</div>
            </div>
        );
    }
}

export default LatexPage;
