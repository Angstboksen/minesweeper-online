
import React, { Component } from 'react'
import Header from './Header'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { DIFF_COLORS, } from '../constants'
import SpectatingBoard from './SpectatingBoard'

export class SpectatePage extends Component {

    state = {
        loading: true,
        online_users: [],
        current_game: undefined
    }

    constructor(props) {
        super(props)
        this.interval = undefined
        this.board = undefined
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this._getUsers()
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    _getUsers = async () => {
        const res = await axios(REQUEST_FUNCTIONS.GET_ONLINE_USERS())
        const users = res.data
        this.setState({ online_users: users, loading: false })
    }

    spectateGame = async (game_code, user, difficulty) => {
        this.setState({ current_game: undefined }, () => {
            this.setState({ current_game: { game_code: game_code, user: user, difficulty: difficulty } })
        })
    }

    render() {
        const { credentials, _resetState, _login, history } = this.props
        const { loading, online_users, current_game, } = this.state
        return (
            <div style={{ width: "100%" }}>
                <Header
                    credentials={credentials}
                    _resetState={_resetState}
                    _login={_login}
                    history={history}
                    getOnlineUsers={this.props.getOnlineUsers}
                    origin="spectate" />
                {loading ? <Spinner style={{ margin: '20vh 50vw' }} animation="border" variant="danger" /> : <div>
                    <h1>Spectating game</h1>

                    <div className='onlineusersroot'>
                        <h3>Users currently in game</h3>
                        <ListGroup horizontal>{online_users.map((object, i) => {
                            let user = object.user
                            let game_code = object.game
                            let difficulty = object.difficulty
                            return <ListGroupItem
                                onClick={this.spectateGame.bind(this, game_code, user, difficulty)}
                                key={i}
                                variant='dark'
                                className="online_user_item">
                                <p>
                                    Player: <b>{user}</b> | Difficulty: <span style={{ color: DIFF_COLORS[difficulty] }}>{difficulty}</span> | Game code: <b>{game_code}</b>
                                </p>
                            </ListGroupItem>
                        })}
                        </ListGroup>
                    </div>
                    {current_game !== undefined ?
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <h4 >Spectating <b>{current_game.user}</b> playing a game with difficulty <span style={{ color: DIFF_COLORS[current_game.difficulty] }}>{current_game.difficulty}</span> | Game code: <b>{current_game.game_code}</b></h4>

                            <SpectatingBoard difficulty={current_game.difficulty} game_code={current_game.game_code} online_users={online_users} />
                        </div> : null}
                </div>}
            </div>
        )
    }
}

export default SpectatePage
