import logo from './logo.svg';
import './styles/App.css';
import { Component } from 'react'
import Main from './components/main'
import Home from './components/home'
import Login from './components/auth/login'
import StudentTutorSelect from './components/auth/student_tutor_select';
import Username from './components/auth/username';

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
					<Switch>
						<Route path="/login">
							<Login/>
						</Route>
						<Route path="/app/profile/set-role">
							<StudentTutorSelect/>
						</Route>
						<Route path="/app/profile/set-username">
							<Username/>
						</Route>
						<Route path="/app/">
							<Main/>
						</Route>
						<Route path="/">
							<Home/>
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
