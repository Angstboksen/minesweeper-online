import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from './Header';

class Home extends Component {

    getContent = () => {
        const {isSignedIn, username} = this.props.credentials
        return (
            isSignedIn ?
                <div>
                    <p>Hello {username}, you're signed in </p>
                </div>
                :
                <div>
                    <p>You are not signed in</p>
                </div>
        )
    }

    render() {
        return (
            <div>
                <Header
                    credentials={this.props.credentials}
                    _resetState={this.props._resetState}
                    _login={this.props._login}
                    _loginerror={this.props._loginerror}
                    history={this.props.history} />
                <div>
                    <h1>Home page</h1>
                    {this.getContent()}
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
