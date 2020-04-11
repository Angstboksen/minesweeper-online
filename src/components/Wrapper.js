import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Game from './Game'
import Home from './Home'


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
                            <Game />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}


export default Wrapper;
