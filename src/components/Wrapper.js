import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SingleplayerGame from './SingleplayerGame'
import Home from './Home'
import Multiplayer from './Multiplayer';


class Wrapper extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/game">
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
