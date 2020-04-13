import React, { Component } from 'react'
import { connect } from 'react-redux'
import config from '../config'
import { toggle, init, gameover, clear } from '../actions'
import '../styles/Game.css'
import { withRouter } from 'react-router-dom'
import Game from './Game'
import Header from './Header'

class SingleplayerGame extends Component {


  constructor(props) {
    super(props)
    const { difficulty } = this.props
    this.state = { board: this._initBoard(difficulty), seconds: 0}
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCell = this.handleClickCell.bind(this)
    this.handleRightClickCell = this.handleRightClickCell.bind(this)
    this.handleDoubleClickCell = this.handleDoubleClickCell.bind(this)
  }

  _initBoard(difficulty) {
    this._stopTimer(true)
    this.bombPlaces = this._initBombPlaces(difficulty)
    const { boardWidth, boardHeight } = config[difficulty]
    const board = Array.from(
      new Array(boardWidth), () => new Array(boardHeight).fill(
        { bomb: false, bombCount: 0, open: false, flagged: false }
      )
    )
    for (let place of this.bombPlaces) {
      board[place.x][place.y] = Object.assign({}, board[place.x][place.y], { bomb: true })
    }
    return board
  }

  _initBombPlaces(difficulty) {
    const bombPlaces = []
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
    while (bombPlaces.length < bombNum) {
      const x = Math.floor(Math.random() * boardWidth)
      const y = Math.floor(Math.random() * boardHeight)
      if (bombPlaces.length === 0) {
        bombPlaces.push({ x: x, y: y })
      } else {
        const duplicated = bombPlaces.filter((place) => {
          return place.x === x && place.y === y
        }).length > 0
        if (!duplicated) {
          bombPlaces.push({ x: x, y: y })
        }
      }
    }
    return bombPlaces
  }

  handleClick(e) {
    e.preventDefault()
    const { difficulty } = this.props
    this.props.dispatch(init())
    this.setState({ board: this._initBoard(difficulty) })
  }

  handleClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear || this.state.board[x][y].flagged) {
      return
    }
    this._open(x, y)
  }

  handleRightClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear) {
      return
    }
    this._toggleFlag(x, y)
  }

  handleDoubleClickCell(x, y) {
    const { gameover, clear, difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    const { board } = this.state
    if (gameover || clear) {
      return
    }
    if (board[x][y].open || board[x][y].flagged) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
          (j < 0 || j >= boardHeight) ||
          (i === x && j === y) ||
          (board[i][j].flagged)) {
          continue
        }
        this._open(i, j)
      }
    }
  }

  showAllBombs = (board) => {
    for (let bomb of this.bombPlaces) {
      let x = bomb.x
      let y = bomb.y
      if (board[x][y].bomb) {
        board[x][y] = Object.assign({}, board[x][y], { open: true })
      }
    }
    this.setState({ board }, () => {
      this.props.dispatch(gameover())
    })
  }

  _open(x, y) {
    const board = [].concat(this.state.board)
    if (!board[x][y].open) {
      const { boardWidth, boardHeight } = config[this.props.difficulty]
      let bombCount = 0
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if ((i < 0 || i >= boardWidth) ||
            (j < 0 || j >= boardHeight) ||
            (i === x && j === y)) {
            continue
          }
          if (board[i][j].bomb) {
            bombCount++
          }
        }
      }
      board[x][y] = Object.assign({}, board[x][y], { open: true, bombCount: bombCount })
      this.setState({ board })
      if (board[x][y].flagged) {
        this._toggleFlag(x, y)
      }
      if (board[x][y].bomb) {
        this._stopTimer()
        this.showAllBombs(board)
      }
      if (this._isClear(board)) {
        this._stopTimer()
        this.props.dispatch(clear())
      }

      if (bombCount === 0 && !board[x][y].bomb) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= boardWidth) ||
              (j < 0 || j >= boardHeight) ||
              (i === x && j === y) ||
              (board[i][j].flagged)) {
              continue
            }
            this._open(i, j)
          }
        }
      }
    }
  }

  _isClear(board) {
    let openCount = 0
    let flagCount = 0
    const { difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        } else if(cell.flagged) {
          flagCount++
        }
      })
    })
    if (openCount === 1) {
      this._startTimer()
    }
    return openCount === (boardWidth * boardHeight - flagCount)
  }

  _toggleFlag(x, y) {
    const board = [].concat(this.state.board)
    const { flagged } = board[x][y]
    board[x][y] = Object.assign({}, board[x][y], { flagged: !flagged })
    this.setState({ board })
    this.props.dispatch(toggle(!flagged))
  }

  updateBoard = (difficulty) => {
    console.log(difficulty)
    this.setState({ board: this._initBoard(difficulty) })
  }

  setDifficulty = () => {
    let width = document.getElementById("widthinput").value
    let height = document.getElementById("heightinput").value
    let difficulty = {
      name: "custom",
      boardWidth: width,
      boardHeight: height,
      bombNum: width * height / 0.20,
      cellSize: 32
    }
    this.updateBoard(difficulty.name)
  }

  _startTimer = async () => {
    this.setState({ gameIsRunning: true, seconds: -1}, async () => {
      while (this.state.gameIsRunning) {
        this.setState({ seconds: this.state.seconds += 1 })
        await new Promise(r => setTimeout(r, 1000));
      }
    })
  }

  _stopTimer = (reset = false) => {
    if(reset) {
      this.setState({ gameIsRunning: false, seconds: 0})
    } else {
      this.setState({ gameIsRunning: false })
    }
  }

  formatClockValue = (isSeconds) => {
    const {seconds} = this.state
    if(isSeconds){
      let s = seconds % 60
      return (s >= 10 ? ""+s : "0"+s)
    }else {
      let m = Math.floor(seconds / 60)
      return (m >= 10 ? ""+m : "0"+m)
    }

  }

  render() {
    const { board, seconds, gameIsRunning } = this.state
    const { difficulty, bomb } = this.props
    const { boardWidth, cellSize } = config[difficulty]
    const boardWidthPx = boardWidth * cellSize
    const { gameover, clear } = this.props
    let status = <span className="status"></span>
    if (gameover) {
      status = <span id="gameover" className="status">GAME OVER!</span>
    } else if (clear) {
      status = <span id="clear" className="status">Cleared, you win!</span>
    } else if (gameIsRunning) {
      status = <span id="running" className="status">Still going strong!</span>
    } else if (!gameIsRunning) {
      status = <span id="notstarted" className="status">Click a cell to start a game!</span>
    }
    return (
      <div style={{ width: "100%" }}>
        <Header
          credentials={this.props.credentials}
          _resetState={this.props._resetState}
          _login={this.props._login}
          _loginerror={this.props._loginerror}
          history={this.props.history}
          origin="singleplayer"
        />

        <div>
          <h1>Minesweeper Singleplayer</h1>
          <h2>{status}</h2>
          <div className="clock">
            <div className="clockWrapper">
              <div className="minutes">
                <div className="first">
                 <div className="number">{this.formatClockValue(false)}</div>
                </div>
              </div>
              <div className="tick">:</div>
              <div className="seconds">
                <div className="first">
                  <div className="number">{this.formatClockValue(true)}</div>
                </div>
              </div>
            </div>
          </div>

          <Game
            board={board}
            cellSize={cellSize}
            difficulty={difficulty}
            bomb={bomb}
            boardWidthPx={boardWidthPx}
            changeDifficulty={this.changeDifficulty}
            dispatch={this.props.dispatch}
            updateBoard={this.updateBoard}
            handleClick={this.handleClick}
            handleClickCell={this.handleClickCell}
            handleRightClickCell={this.handleRightClickCell}
            handleDoubleClickCell={this.handleDoubleClickCell} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state.game

export default withRouter(connect(mapStateToProps)(SingleplayerGame))
