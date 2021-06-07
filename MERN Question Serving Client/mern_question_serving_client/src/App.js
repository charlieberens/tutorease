import logo from './logo.svg';
import './styles/App.css';
import { Component } from 'react'
import TutorPanel from './components/tutor/tutor_panel'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component {
  constructor(props){
    super(props);
  }

  render(){  
        // <Question />
    return (
      <div className="App">
        {/* Popups */}
        <Router>
          <Link to="/">Home</Link>
          <Link to="/tutors">Tutors</Link>

          <Switch>
            <Route path="/tutors">
              <TutorPanel/>
            </Route>
            <Route path="/">
              Home
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
