import React from 'react';
import '../style/style.css'
import getSuccessResponse from '../utils/getSuccessResponse'
import {Amplify, Auth} from 'aws-amplify';
import awsExports from '../aws-exports';
import {Navigate} from "react-router-dom";
Amplify.configure(awsExports);
export default class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toHome: false,
            signUpTrue: false,
            userSigned: false,
            loggedIn: false,
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
        console.log(signUpUsername, signUpPassword, signUpPasswordConfirmed, signUpEmail);
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
                this.setState({userInfo: user, userSigned: true })
                console.log(user);
                const result = { Items: user };
                return getSuccessResponse(result, 200);
            }
            else alert('Password is not match!');
        } catch (error) { console.log(error); }
    }
    userConfirmByCode = async () => {
        console.log(this.state.userInfo);
        const code = document.getElementById('userConfirmCode').value;
        const result = await Auth.confirmSignUp(this.state.userInfo.username, code);
        this.setState({signUpTrue: false, userSigned: false, loggedIn: false});
        alert(result);
    }
    resendConfirmCode = async () => {
        await Auth.resendSignUp(this.state.userInfo.username);
    }
    homePage = () => {
        this.setState({ toHome: true });
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
                                <a href="/reset">Forgot password?</a>
                            </div>
                            <input type="button" value="Login test" id="login-test-button" onClick={this.login} />
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
                            <input type="button" value="Signup test" onClick={this.signUp}/>
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
    renderConfirmVerification = () => {
        return (
            <div>
                <input type='button' value='Home' onClick={this.homePage} />
                <div>
                    <h3>Enter Verification Code</h3>
                </div>
                <div>
                    <input type='text' placeholder='Verification Code' id='userConfirmCode'/>
                    <input type='button' value='Confirm' onClick={this.userConfirmByCode} />
                </div>
                <div>
                    <input type='button' value='Resend activation code' onClick={this.resendConfirmCode} />
                </div>
            </div>
        )
    }
    renderToHome = () => { return ( <Navigate to="/" replace={true} /> ); }
    render = () => {
        if(this.state.toHome) return this.renderToHome();
        if (!this.state.signUpTrue) {
            if (this.state.loggedIn) return <Navigate to="/user" replace={true} />;
            else return this.renderLogin();
        }
        else if (this.state.userSigned) return this.renderConfirmVerification();
            else return this.renderSignUp();
    }
}