import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SingleplayerGame from './SingleplayerGame'
import Home from './Home'
import MultiplayerGame from './MultiplayerGame';
import { DEFAULT_WRAPPER_STATE } from '../constants'
import axios from 'axios'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import { DEFAULT_EMPTY_HIGHSCORES } from '../constants'


class Wrapper extends Component {

    constructor(props) {
        super(props)
        if (this.state === undefined) {
            this.state = DEFAULT_WRAPPER_STATE
        }
    }

    _login = async (response) => {
        const { googleId, givenName, familyName, email, imageUrl } = response.profileObj
        const res = await axios(REQUEST_FUNCTIONS.GET_TOKEN(googleId, googleId))
            .catch(async () => {
                const user = await axios(REQUEST_FUNCTIONS.POST_USER(googleId, givenName, familyName, email))
                console.log(user)
                const token = await axios(REQUEST_FUNCTIONS.GET_TOKEN(googleId, googleId))
                this.setState({
                    isSignedIn: true,
                    username: givenName,
                    useremail: email,
                    userimageurl: imageUrl,
                    token: token
                }, () => {
                    this.getHighscores()
                    //console.clear()
                })
                return
            })

        if (res !== undefined && res.status === 200) {
            this.setState({
                isSignedIn: true,
                username: givenName,
                useremail: email,
                userimageurl: imageUrl,
                token: res.data.token
            }, () => {
                this.getHighscores()
                //console.clear()
            })
        }

    }

    _loginerror = (response) => {
        console.log("Error occured")
    }

    _resetState = () => {
        this.setState(DEFAULT_WRAPPER_STATE)
    }

    sortHighscores = (highscores) => {
        return highscores.sort(function (a, b) {
            return a.game_time - b.game_time;
        })
    }

    getHighscores = async () => {
        const {token} = this.state
        if (token === undefined) {
            return DEFAULT_EMPTY_HIGHSCORES
        }
        const response = await axios(REQUEST_FUNCTIONS.GET_HIGHSCORELIST(token))
        const highscores = response.data
        const obj = {
            "easy": this.sortHighscores(highscores.filter(h => h.difficulty === 'easy')),
            "normal": this.sortHighscores(highscores.filter(h => h.difficulty === 'normal')),
            "hard": this.sortHighscores(highscores.filter(h => h.difficulty === 'hard')),
            "veryHard": this.sortHighscores(highscores.filter(h => h.difficulty === 'veryHard')),
            "maniac": this.sortHighscores(highscores.filter(h => h.difficulty === 'maniac')),
            'loaded': true
        }
        return this.setState({ highscores: obj })
    }

    _saveGame = async (time, difficulty, game_won) => {
        let placements = null
        let placement = -1
        if (game_won) {
            const obj = {
                'game_time': time,
                'difficulty': difficulty,
                'game_won': game_won
            }
            this.setState(prevState => {
                let highscores = Object.assign({}, prevState.highscores)
                highscores[difficulty] = [...highscores[difficulty], obj].sort(function (a, b) {
                    return a.game_time - b.game_time;
                })
                return { highscores }
            }, () => {
                placements = this.state.highscores[difficulty]
                for (let i = 0; i < placements.length; i++) {
                    if (placements[i].game_time === time) {
                        placement = i + 1
                    }
                }
            })
        }
        if (this.state.isSignedIn) {
            await axios(REQUEST_FUNCTIONS.POST_GAME(this.state.token, time, game_won, difficulty))
        }
        this.setState({ latestHighscore: placement })
    }

    _updateDifficulty = (difficulty) => {
        this.setState({difficulty : difficulty})
    }

    render() {
        return (
            <Router>
                <>
                    <Switch>
                        <Route exact path="/">
                            <Home
                                credentials={this.state}
                                _login={this._login}
                                _loginerror={this._loginerror}
                                _resetState={this._resetState} />
                        </Route>
                        <Route path="/singleplayer">
                            <SingleplayerGame
                                credentials={this.state}
                                _login={this._login}
                                _loginerror={this._loginerror}
                                _resetState={this._resetState}
                                _saveGame={this._saveGame}
                                _updateDifficulty={this._updateDifficulty} />
                        </Route>
                        <Route path="/multiplayer">
                            <MultiplayerGame
                                credentials={this.state}
                                _login={this._login}
                                _loginerror={this._loginerror}
                                _resetState={this._resetState} />
                        </Route>
                    </Switch>
                </>
            </Router>
        );
    }
}


export default Wrapper;
