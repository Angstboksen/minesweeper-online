import React, { Component } from 'react'
import Header from './Header'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import axios from 'axios'

export class MultiplayerGame extends Component {

    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind()
    }

    validateOpponentEmail = async () => {
        const email = document.getElementById('opponentEmailInput').value
        if(email === "" || email === this.props.credentials.useremail) {
            return false
        }
        const res = await axios(REQUEST_FUNCTIONS.CHECK_USER_EXIST(email))
        return [JSON.parse(res.data.content), email]
    }

    onSubmit = async (e) => {
        e.preventDefault()
        //const validated = await this.validateOpponentEmail()
        //if(validated[0]) this.postBaseGame(validated[1])
        this.postBaseGame("dabdabdab")
    }

    postBaseGame = async (opponent) => {
        const {useremail, difficulty} = this.props.credentials
        const randhex = randHex(8)
        console.log(useremail)
        console.log(difficulty)
        console.log(opponent)
        console.log(randhex)
        //const res = await axios(REQUEST_FUNCTIONS.POST_MULTIPLAYER_GAME(useremail, opponent , difficulty, randhex))
        //this.props.history.push(`multiplayer/${randhex}`)
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
                    origin="multiplayer"
                />
                <h1>Duel a friend!</h1>
                <div className="invite-div">
                    <Form onSubmit = {this.onSubmit}>
                        <Form.Group >
                            <Form.Label>Enter the email of your opponent</Form.Label>
                            <Form.Control id="opponentEmailInput" type="email" placeholder="email@example.com" />
                            <Form.Text className="text-muted">
                                You will have to share the link to the user yourself, for now 
                        </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">Create game</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

const randHex = (len) => {
    let maxlen = 8
    let min = Math.pow(16,Math.min(len,maxlen)-1) 
    let max = Math.pow(16,Math.min(len,maxlen)) - 1
    let n   = Math.floor( Math.random() * (max-min+1) ) + min
    let r   = n.toString(16)
    while ( r.length < len ) {
       r = r + randHex( len - maxlen );
    }
    return r;
  };

export default withRouter(MultiplayerGame)
