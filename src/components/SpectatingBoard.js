import React, { Component } from 'react'
import axios from 'axios'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'
import config from '../config'
import Game from './Game'

export class SpectatingBoard extends Component {

    state = {
        board: [],
        difficulty: 'easy'
    }

    constructor(props) {
        super(props)
        this.interval = undefined
    }

    componentDidMount() {
        this._getGame()
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
        const {game_code} = this.props
        const res = await axios(REQUEST_FUNCTIONS.GET_GAME_INSTANCE(game_code))
        console.log(res.data)
        this.setState({ game: res.data, board: this._tempBoard(res.data.difficulty), difficulty: res.data.difficulty }, () => {
            this.interval = setInterval(() => {
                this._fetchBoard()
            }, 1000);
        })
    }

    _fetchBoard = async () => {
        const {game_code} = this.props
        const res = await axios(REQUEST_FUNCTIONS.GET_GAME_COORDINATES(game_code))
        console.log(res.data)
        this._updateBoard(res.data)
    }

    _updateBoard = (coords) => {
        let board = [].concat(this.state.board)
        for (let coord of coords) {
            const x = coord.x_coord
            const y = coord.y_coord
            board[x][y] = Object.assign({}, board[x][y], { open: coord.opened, flagged: coord.flagged, bombCount: coord.bomb_count })
        }
        this.setState({ board })
    }

    render() {
        const { board, difficulty } = this.state
        const { cellSize, boardWidth } = config[difficulty]
        return (
            <div>
                <Game
                    board={board}
                    cellSize={cellSize}
                    difficulty={difficulty}
                    boardWidthPx={boardWidth}
                    handleClick={() => {}}
                    handleClickCell={() => {}}
                    handleRightClickCell={() => {}}
                    handleDoubleClickCell={() => {}} />
            </div>
        )
    }
}

export default SpectatingBoard
