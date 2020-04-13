import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from './Header';

class Home extends Component {

    getContent = () => {
        const { isSignedIn, username } = this.props.credentials
        return isSignedIn ?
            <p>Hello {username}, you're signed in </p>
            :
            <p>You are not signed in</p>

    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                <Header
                    credentials={this.props.credentials}
                    _resetState={this.props._resetState}
                    _login={this.props._login}
                    _loginerror={this.props._loginerror}
                    history={this.props.history}
                    origin="home" />
                <div>
                    <h1>Home page</h1>
                    <div style={{ textAlign: "center" }}>
                        {this.getContent()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
