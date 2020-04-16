import React, { Component } from 'react'
import { ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import { DIFF_COLORS, } from '../constants'

export class HighscoreList extends Component {


    getVariant = (position) => {
        if (position > 7) {
            return "danger"
        } else if (position > 5) {
            return "warning"
        } else if (position > 2) {
            return "primary"
        } else {
            return "success"
        }
    }

    render() {
        const { difficulty, highscores, credentials, highscoresloaded } = this.props
        return credentials.isSignedIn ? (<div id="highscoreroot">
                    <h3>Personal highscores!</h3>
                    <p style={{ color: DIFF_COLORS[difficulty] }}>{difficulty.toUpperCase()}</p>
                    {(!highscoresloaded) ? <Spinner animation="border" variant="dark" /> : null}
                    {(highscores.length === 0) ? <p>Get to gaming then!</p> : null}
                    <ListGroup>{highscores.slice(0, 10).map((object, i) => {
                        let score = object.game_time
                        let min = Math.floor(score / 6000)
                        let sec = ((score / 100) % 60).toFixed(2)
                        return min > 0 ?
                            <ListGroupItem key={i} variant={this.getVariant(i)}><p className="highscorenumber">{i + 1}</p> : {min} minutes {sec} seconds</ListGroupItem> :
                            <ListGroupItem key={i} variant={this.getVariant(i)}><p className="highscorenumber">{i + 1}</p> : {sec} seconds</ListGroupItem>
                    })}
                    </ListGroup>
            </div>) : null
    }
}

export default HighscoreList
