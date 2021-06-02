import logo from './logo.svg';
import './App.css';

import { Component } from 'react'
import Question from './components/question.jsx'
import CreateQuestion from './components/create_question.jsx'
import Popup from './components/popup.jsx'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      popupOpen: false,
      popupInner: null
    }
  }
  controlPopup = (open, popupChild) => { //Open argument = true for opening and false for closing
    this.setState({
      popupOpen: open,
      popupInner: popupChild
    });
  }
  render(){  
    return (
      <div className="App">
        <Question />
        <CreateQuestion popupMethod={this.controlPopup}/>
        {this.state.popupOpen &&
          <Popup className="popup-cont" popupMethod={this.controlPopup}>{this.state.popupInner}</Popup>
        }
      </div>
    );
  }
}

export default App;
