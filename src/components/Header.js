import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'

export class Header extends Component {

    _logout = () => {
        this.props._resetState()
        this.props.history.push("/")
    }

    render() {
        const { isSignedIn} = this.props.credentials
        return isSignedIn ?
            <div>
                <GoogleLogout
                    clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={this._logout}
                />
            </div>
            :
            <div>
                <GoogleLogin
                    clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.props._login}
                    onFailure={this.props._loginerror}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            </div>

    }
}

export default Header
