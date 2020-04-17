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
        const { difficulty, highscores, credentials, highscoresloaded, isGlobalHighscoreList } = this.props
        const isGlobal = isGlobalHighscoreList
        return credentials.isSignedIn ? (<div id="highscoreroot">
            {isGlobalHighscoreList ?
                <h3>Leaderbords for <span style={{ color: DIFF_COLORS[difficulty] }}>{difficulty.toUpperCase()}</span></h3> :
                <h3>Personal highscores!</h3>}
            <p style={{ color: DIFF_COLORS[difficulty] }}>{difficulty.toUpperCase()}</p>
            {(!highscoresloaded) ? <Spinner animation="border" variant="dark" /> : null}
            {(highscores.length === 0) ? <p>No {isGlobal ? "leaderbords" : "highscores"} for <span style={{ color: DIFF_COLORS[difficulty] }}>{difficulty.toUpperCase()}
            </span>  difficulty stored!</p> : null}
            <ListGroup>{highscores.slice(0, 10).map((object, i) => {
                let score = object.game_time
                let min = Math.floor(score / 60000)
                let sec = ((score / 1000) % 60).toFixed(3)
                return min > 0 ?
            <ListGroupItem key={i} variant={this.getVariant(i)}><p className="highscorenumber">{i + 1}</p> : {min} minutes {sec} seconds {isGlobal ?  <p style={{display : 'inline'}}><b>({object.user_name})</b></p> : null}</ListGroupItem> :
                    <ListGroupItem key={i} variant={this.getVariant(i)}><p className="highscorenumber">{i + 1}</p> : {sec} seconds {isGlobal ? <p style={{display : 'inline'}}><b>({object.user_name})</b></p> : null}</ListGroupItem>
            })}
            </ListGroup>
        </div>) : null
    }
}

export default HighscoreList
