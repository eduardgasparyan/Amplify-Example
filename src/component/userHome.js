import React from 'react'
import {Navigate} from "react-router-dom";

export default class userHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: false
        }
    }
    logout = () => {
        this.setState({ logout: true })
    }

    renderNormal = () => {
        return (
            <div>
                Hello User.
                <input type='button' value='Logout' onClick={this.logout} />
            </div>
        )
    }
    renderLogout = () => {
        return ( <Navigate to="/login" replace={true} /> );
    }
    render = () => {
        if(!this.state.logout) return this.renderNormal();
        else return this.renderLogout();
    }

}