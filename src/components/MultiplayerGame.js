import React, { Component } from 'react'
import Header from './Header'
import {withRouter} from 'react-router-dom'

export class MultiplayerGame extends Component {
    render() {
        return (
            <div style={{ width: "100%" }}>
                <Header
                    credentials={this.props.credentials}
                    _resetState={this.props._resetState}
                    _login={this.props._login}
                    _loginerror={this.props._loginerror}
                    history={this.props.history}
                    origin="multiplayer"
                />
                This is a multiplayer game!
            </div>
        )
    }
}

export default withRouter(MultiplayerGame)
