import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'

export class Header extends Component {

    _logout = () => {
        this.props._resetState()
        this.props.history.push("/")
    }

    _login = (response) => {
        this.props._login(response)
        this.props.history.push("/singleplayer")
    }

    render() {
        const {isSignedIn, username} = this.props.credentials
        return isSignedIn ?
            <div>
                <GoogleLogout
                    clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={this._logout}
                />
                <h1>{username}</h1>
            </div>
            :
            <div>
                <GoogleLogin
                    clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this._login}
                    onFailure={this.props._loginerror}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            </div>

    }
}

export default Header
