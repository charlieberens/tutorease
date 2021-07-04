import React, { Component, PropTypes } from 'react';
import {FcGoogle} from "react-icons/fc";
import Back from "../back";
import axios from 'axios';
import '../../styles/auth.css'

import { withRouter } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = () => {
        axios.get('/api/users/').then(res => {
            if(res.data){
                window.location.replace("/app/");
            }
        });
    }

    render() {
        return (
            <div className="login-page">
                <Back/>
                <a className="sign-in-with-google button" href="/auth/google"><FcGoogle className="sign-in-with-google-icon"/><span>Sign in with Google</span></a>
            </div>
        );
    }
}

export default withRouter(Login);
