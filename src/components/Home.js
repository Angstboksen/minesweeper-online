import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'

class Home extends Component {

    _enterGame = () => {
        console.log("Hoik")
        this.props.history.push("/game")
    
    }

    render() {
        return (
            <div>
                <h1>Home page</h1>
                <div>
                    <p>Click the button to log in</p>
                    <button onClick={this._enterGame}>Enter game!</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
