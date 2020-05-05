import React, { Component } from 'react'
import axios from 'axios'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import config from '../config'
import Game from './Game'
import { GiFireBomb } from "react-icons/gi"

export class SpectatingBoard extends Component {

    state = {
        board: [],
        difficulty: 'easy',
        flagCount: 0,
        millis: 0,
        gameover: false,
    }

    constructor(props) {
        super(props)
        this.interval = undefined
        this.clock = undefined
    }

    componentDidMount() {
        this._getGame()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        clearInterval(this.clock)
    }

    _tempBoard(difficulty) {
        const { boardWidth, boardHeight } = config[difficulty]
        const board = Array.from(
            new Array(boardWidth), () => new Array(boardHeight).fill(
                { bomb: false, bombCount: 0, open: false, flagged: false }
            )
        )
        return board
    }

    _getGame = async () => {
        const { game_code } = this.props
        const res = await axios(REQUEST_FUNCTIONS.GET_GAME_INSTANCE(game_code))
        this.setState({ game: res.data, board: this._tempBoard(res.data.difficulty), difficulty: res.data.difficulty, starttime: res.data.game_time }, () => {
            this.interval = setInterval(() => {
                this._fetchBoard()
            }, 1000);
            this._startTimer()
        })
    }

    _fetchBoard = async () => {
        const { game_code, online_users } = this.props
        const res = await axios(REQUEST_FUNCTIONS.GET_GAME_COORDINATES(game_code))
        const coords = res.data
        const last_coord = coords[coords.length -1]
        if (!last_coord.gameover || online_users.length <= 0) {
            this._updateBoard(coords)
        } else {
            this._stopTimer()
        }
    }

    _updateBoard = (coords) => {
        let board = [].concat(this.state.board)
        let flagCount = 0
        for (let coord of coords) {
            flagCount += coord.flagged
            const x = coord.x_coord
            const y = coord.y_coord
            board[x][y] = Object.assign({}, board[x][y], { open: coord.opened, flagged: coord.flagged, bombCount: coord.bomb_count })
        }
        this.setState({ board: board, flagCount: flagCount })
    }

    formatClockValue = (type) => {
        const { millis } = this.state
        switch (type) {
            case "minutes":
                let m = Math.floor((millis / 60000))
                return (m >= 10 ? "" + m : "0" + m)
            case "seconds":
                let s = Math.floor(millis / 1000) % 60
                return (s >= 10 ? "" + s : "0" + s)
            case "millis":
                let mi = millis.toString()
                mi = mi.substring(mi.length - 3)
                return mi
            default:
                return 0
        }
    }

    _startTimer = () => {
        this.setState({ gameover: false })
        this.clock = setInterval(() => {
            let currenttime = Date.now()
            this.setState({ millis: currenttime - this.state.starttime })
        }, 1)
    }

    _stopTimer = async () => {
        const res = await axios(REQUEST_FUNCTIONS.GET_GAME_INSTANCE(this.props.game_code))
        const endtime = res.data.game_time
        this.setState({ millis: endtime, gameover: true })
        clearInterval(this.clock)
        clearInterval(this.interval)
    }

    render() {
        const { board, difficulty, flagCount, gameover } = this.state
        const { cellSize, boardWidth, bombNum } = config[difficulty]
        const boardWidthPx = boardWidth * cellSize
        return (
            <div>
                {gameover ? <h2 style={{ color: 'red' }}>GAMEOVER!</h2> : <h2 style={{ color: 'blue' }}>Ongoing</h2>}
                <h5>Time</h5>
                <div className="clock">
                    <div className="clockWrapper">
                        <div className="minutes">
                            <div className="first">
                                <div className="number">{this.formatClockValue("minutes")}</div>
                            </div>
                        </div>
                        <div className="tick">:</div>
                        <div className="seconds">
                            <div className="first">
                                <div className="number">{this.formatClockValue("seconds")}</div>
                            </div>
                        </div>
                        <div className="tick">.</div>
                        <div className="millis">
                            <div className="first">
                                <div className="number">{this.formatClockValue("millis")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <span id="bomb">Bombs left: <GiFireBomb style={{ marginTop: -3 }} /> {bombNum - flagCount}</span>
                <Game
                    board={board}
                    cellSize={cellSize}
                    difficulty={difficulty}
                    boardWidthPx={boardWidthPx}
                    handleClick={() => { }}
                    handleClickCell={() => { }}
                    handleRightClickCell={() => { }}
                    handleDoubleClickCell={() => { }} />
            </div>
        )
    }
}

export default SpectatingBoard
