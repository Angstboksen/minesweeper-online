import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

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

    showDifficulty = () => {
        const {difficulty} = this.props
        let color = "green"
        switch (difficulty) {
            case "normal":
                color = "orange"
                break;
            case "hard":
                color = "tomato"
                break;
            case "veryHard":
                color = "	orangered"
                break;
            case "maniac":
                color = "darkslategray"
                break;
            default:
                color = "green"
                break;

        }
        return <p style={{color: color}}>{difficulty.toUpperCase()}</p>
    }

    render() {
        return (
            <div id="highscoreroot">
                <h3>Personal highscores!</h3>
                {this.showDifficulty()}
                {this.props.highscores.length === 0 && <p>Get to gaming then!</p>}
                <ListGroup>{this.props.highscores.slice(0, 10).map((score, i) => {
                    let min = Math.floor(score / 6000)
                    let sec = (score / 100) % 60
                    return min > 0 ?
                        <ListGroupItem key={i} variant={this.getVariant(i)}>{min} minutes {sec} seconds</ListGroupItem> :
                        <ListGroupItem key={i} variant={this.getVariant(i)}>{sec} seconds</ListGroupItem>
                })}
                </ListGroup>
            </div>
        )
    }
}

export default HighscoreList
