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
                await axios(REQUEST_FUNCTIONS.POST_USER(googleId, givenName, familyName, email))
                await axios(REQUEST_FUNCTIONS.GET_TOKEN(googleId, googleId))
            })

        if (res !== undefined && res.status === 200) {
            this.setState({
                isSignedIn: true,
                username: givenName,
                useremail: email,
                userimageurl: imageUrl,
                googleId: googleId,
                token: res.data.token
            }, async () => {
                this.getHighscores()
                this.getGlobalHighscores()
                const res = await axios(REQUEST_FUNCTIONS.GET_USER(this.state.token))
                const id = res.data.id
                this.setState({ userId: id })
                //console.clear()
            })
        }
    }

    _loginerror = (response) => {
        console.log(response)
    }

    _resetState = async () => {
        const { googleId, useremail, userId } = this.state
        const editonline = await axios(REQUEST_FUNCTIONS.PUT_USER_ONLINE(userId, googleId, useremail, false))
        this.setState(DEFAULT_WRAPPER_STATE)
        return editonline
    }

    sortHighscores = (highscores) => {
        return highscores.sort(function (a, b) {
            return a.game_time - b.game_time;
        })
    }

    getHighscores = async () => {
        const { token } = this.state
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

    getGlobalHighscores = async () => {
        const response = await axios(REQUEST_FUNCTIONS.GET_GLOBAL_HIGHSCORES())
        const highscores = response.data
        const obj = {
            "easy": this.sortHighscores(highscores.filter(h => h.difficulty === 'easy')),
            "normal": this.sortHighscores(highscores.filter(h => h.difficulty === 'normal')),
            "hard": this.sortHighscores(highscores.filter(h => h.difficulty === 'hard')),
            "veryHard": this.sortHighscores(highscores.filter(h => h.difficulty === 'veryHard')),
            "maniac": this.sortHighscores(highscores.filter(h => h.difficulty === 'maniac')),
            'loaded': true
        }
        this.setState({ globalhighscores: obj })
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
            this.getGlobalHighscores()
        }
        this.setState({ latestHighscore: placement })
    }

    _updateDifficulty = (difficulty) => {
        this.setState({ difficulty: difficulty })
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
