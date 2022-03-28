import React from 'react';
import '../style/style.css'
import getSuccessResponse from '../utils/getSuccessResponse'
import {Amplify, Auth} from 'aws-amplify';
import awsExports from '../aws-exports';
import axios from "axios";
Amplify.configure(awsExports);
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpTrue: false,
            userInfo: {},
            loggedIn: false
        }
    }
    signUpFormSlide = () => {
        this.setState({ signUpTrue: true })
    }
    loginFormSlide = () => {
        this.setState({ signUpTrue: false })
    }
    login = async () => {
        const loginUsername = document.getElementById('login-username').value;
        const loginPassword = document.getElementById('login-password').value;
        console.log(loginUsername, loginPassword)
        try {
            const user = await Auth.signIn(loginUsername, loginPassword);
            console.log(user);
            const result = { Items: user };
            const response = getSuccessResponse(result, 200);
            console.log(response);
            this.setState({userInfo: user, loggedIn: true});
        } catch (error) { console.log(error) }
    }
    signUp = async () => {
        const signUpUsername = document.getElementById('signup-username').value;
        const signUpPassword = document.getElementById('signup-password').value;
        const signUpPasswordConfirmed = document.getElementById('signup-password-confirmed').value;
        const signUpEmail = document.getElementById('signup-email').value;
        try {
            if (signUpPassword === signUpPasswordConfirmed) {
                const { user } = await Auth.signUp({
                    username: signUpUsername,
                    password: signUpPassword,
                    attributes: {
                        email: signUpEmail,
                    }
                });
                console.log(user);
                const result = { Items: user };
                return getSuccessResponse(result, 200);
            }
            else alert('Password is not match!');
        } catch (error) { console.log(error); }
    }
    userAddCar = () => {
        const carName = document.getElementById('addingCarName').value;
        try {
            axios.post(
                `https://lldkgnmqmf.execute-api.eu-north-1.amazonaws.com/edtest1/users/${this.state.userInfo.pool.clientId}/cars`, {carName})
                .then((response) => { this.setState({response: response.status});
                    console.log(this.state.response) });
        } catch (e) {
            console.log(e);
        }
    }
    renderLogin = () => {
        return (
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">
                        Login
                    </div>
                    <div className="title signup">
                        Signup
                    </div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" onClick={this.loginFormSlide} />
                        <input type="radio" name="slide" id="signup" onClick={this.signUpFormSlide} />
                        <label htmlFor="login" className="slide login">Login</label>
                        <label htmlFor="signup" className="slide signup">Signup</label>
                        <div className="slider-tab"/>
                    </div>
                    <div className="form-inner">
                        <form className="login">
                            <div className="field">
                                <input type="text" placeholder="Username" id="login-username" required/>
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" id="login-password" required/>
                            </div>
                            <div className="pass-link">
                                <a href="#">Forgot password?</a>
                            </div>
                            <input type="button" value="Login" id="login-button" onClick={this.login} />
                            <div className="field btn">
                                <div className="btn-layer"/>
                                <input type="submit" value="Login" id="login-button" onClick={this.login} />
                            </div>
                            <div className="signup-link">
                                Not a member? <a onClick={this.signUpFormSlide}>Signup now</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    renderSignUp = () => {
        return (
            <div className="wrapper">
                <div className="title-text">
                    <div className="title signup">
                        SignUp
                    </div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" onClick={this.loginFormSlide} />
                        <input type="radio" name="slide" id="signup" onClick={this.signUpFormSlide} />
                        <label htmlFor="login" className="slide login">Login</label>
                        <label htmlFor="signup" className="slide signup">Signup</label>
                        <div className="slider-tab"/>
                    </div>
                    <div className="form-inner">
                        <form className="signup">
                            <div className="field">
                                <input type="text" placeholder="Email Address" id="signup-email" required/>
                            </div>
                            <div className="field">
                                <input type="text" placeholder="Username" id="signup-username" required/>
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" id="signup-password" required/>
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Confirm Password" id="signup-password-confirmed" required/>
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"/>
                                <input type="submit" value="Signup" onClick={this.signUp}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    // renderReset = () => {
    //     return (
    //         <div className="wrapper">
    //             <input type=text placeholder="Enter your email" />
    //         </div>
    //     )
    // }
    renderSigned = (user) => {
        return (
            <div>
                <div>
                    <h3>Hi { this.state.userInfo.username }</h3>
                </div>
                <div>
                    Your car list.
                </div>
                <div>
                    <input type='text' placeholder='Car Name' id='addingCarName'/>
                    <input type='button' value='Add Car' onClick={this.userAddCar} />
                </div>
            </div>
        )
    }
    render = () => {
        if (!this.state.signUpTrue) {
            if (this.state.loggedIn) return this.renderSigned();
            else return this.renderLogin();
        }
        else return this.renderSignUp();
    }
}