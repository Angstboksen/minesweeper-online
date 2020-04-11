import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from './Header';

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
                    <p>You are not signed in</p>
                </div>
            )
        }
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
