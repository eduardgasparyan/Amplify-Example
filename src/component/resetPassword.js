import React from 'react'
import {Amplify, Auth} from "aws-amplify";
import awsExports from "../aws-exports";
import {Navigate} from "react-router-dom";
Amplify.configure(awsExports);

export default class resetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSent: false,
            toHome: false
        }
    }
    toHome = () => {
     this.setState({ toHome: true });
    }
    reset = async () => {
        const ResetPasswordResult = await Amplify.Auth.resetPassword({
            username: document.getElementById('reset-username').value
        });
        console.log(ResetPasswordResult);
        this.setState({isReset: true});
    }
    change = async () => {
        try {
            await Amplify.Auth.confirmPassword({
                username: document.getElementById('reset-username').value,
                newPassword: document.getElementById('new-password').value,
                confirmationCode: document.getElementById('confirm-code').value,
            });
        } catch (e) {
            console.log(e);
        }
    }

    renderFirst = () => {
        return (
            <div>
                <input type='button' value='Home' onClick={this.toHome} />
                <h3>Enter your username</h3>
                <input type="text" placeholder="Username" id="reset-username" required/>
                <input type="button" value="Reset" id="reset-button" onClick={this.reset} />
            </div>
        )
    }
    renderFinal = () => {
        return (
            <div>
                <input type='button' value='Home' onClick={this.toHome} />
                <h3>Enter your username</h3>
                <input type="text" placeholder="Username" id="reset-username" required/>
                <input type="text" placeholder="New Password" id="new-password" required/>
                <input type="text" placeholder="Confirmation Code" id="confirm-code" required/>
                <input type="button" value="Reset" id="reset-button" onClick={this.change} />
            </div>
        )
    }
    renderToHome = () => { return ( <Navigate to="/" replace={true} /> ); }
    render() {
        if(this.state.toHome) return this.renderToHome();
        if(this.state.isReset) return this.renderFinal();
        else return this.renderFirst();
    }
}