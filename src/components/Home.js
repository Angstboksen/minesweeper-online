import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from './Header';
import { GoogleLogin, GoogleLogout } from 'react-google-login'

const DEFAULT_HOMEPAGE_STATE = {
    username : undefined,
    useremail : undefined,
    userimageurl : undefined,
    isSignedIn : false
}

class Home extends Component {

    state = DEFAULT_HOMEPAGE_STATE

    responseGoogle = (response) => {
        const user = response.profileObj
        this.setState({
            username: user.name,
            useremail: user.email,
            userimageurl: user.imageUrl,
            isSignedIn: true
        })
    }

    responseError = (response) => {
        console.log(response)
    }

    logout = (response) => {
        this.setState(DEFAULT_HOMEPAGE_STATE)
        console.log("Successfully logged out : " + response)
    }

    getContent = () => {
        return (
            this.state.isSignedIn ?
                <div>
                    <p>hello user, you're signed in </p>
                    <GoogleLogout
                        clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}
                    />
                </div>
                :
                <div>
                    <p>You are not signed in</p>
                    <GoogleLogin
                        clientId="450224643692-epj8fht9ckfljd6pgr46g0gc0bts22jb.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseError}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    />
                </div>
        )
    }

    render() {
        return (
            <div>
                <Header />
                <div>
                    <h1>Home page</h1>
                    {this.getContent()}
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
