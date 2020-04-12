import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SingleplayerGame from './SingleplayerGame'
import Home from './Home'
import Multiplayer from './Multiplayer';
import {DEFAULT_WRAPPER_STATE} from '../constants'


class Wrapper extends Component {

    state = DEFAULT_WRAPPER_STATE

    _login = (response) => {
        const {name, email, imageUrl} = response.profileObj
        this.setState({
            username : name,
            useremail: email,
            userimageurl: imageUrl,
            isSignedIn: true
        })
    }

    _loginerror = (response) => {
        console.log(response)
    }

    _resetState = () => {
        this.setState(DEFAULT_WRAPPER_STATE)
    }
    
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Home
                             credentials={this.state}
                             _login={this._login}
                             _loginerror={this._loginerror}
                             _resetState={this._resetState}/>
                        </Route>
                        <Route path="/singleplayer">
                            <SingleplayerGame/>
                        </Route>
                        <Route path="/multiplayer">
                            <Multiplayer/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}


export default Wrapper;
