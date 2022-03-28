import React from 'react'
import {Navigate} from "react-router-dom";
import '../style/style.css'

export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loginButton: false
        }
    }
    login = () => {
        this.setState({ loginButton: true })
    }
    renderNormal () {
        return (
        <div className="btn-layer">
            <input type='button' value='Login' onClick={this.login}/>
        </div>
        )
    }
    render() {
        if (!this.state.loginButton) return this.renderNormal();
        else return (
            <Navigate to="/login" replace={true} />
        )
    }
}