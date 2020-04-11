import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

class Home extends Component {

    _enterGame = () => {
        console.log("Hoik")
        this.props.history.push("/game")

    }

    getContent = () => {
        if (this.props.isSignedIn) {
            return <p>hello user, you're signed in </p>
        } else {
            return (
                <div>
                    <p>You are not signed in. Click here to sign in.</p>
                    <div className="g-signin2" data-onsuccess="onSignIn">Log in</div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <h1>Home page</h1>
                {this.getContent()}
            </div>
        );
    }
}

export default withRouter(Home);
