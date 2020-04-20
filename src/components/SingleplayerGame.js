import React, { Component } from 'react'
import { connect } from 'react-redux'
import config from '../config'
import { toggle, init, gameover, clear } from '../actions'
import '../styles/Game.css'
import { withRouter } from 'react-router-dom'
import Game from './Game'
import Header from './Header'
import { GiFireBomb } from "react-icons/gi"
import { changeDifficulty } from '../actions'
import HighscoreList from './HighscoreList'
import axios from 'axios'
import REQUEST_FUNCTIONS from '../httprequests/RequestConfigs'

class SingleplayerGame extends Component {


  constructor(props) {
    super(props)
    const { difficulty } = this.props
    this.state = { board: this._initBoard(difficulty), millis: 0 }
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCell = this.handleClickCell.bind(this)
    this.handleRightClickCell = this.handleRightClickCell.bind(this)
    this.handleDoubleClickCell = this.handleDoubleClickCell.bind(this)
    this.clock = undefined
  }

  _initBoard(difficulty, hitBomb = false, startX = 0, startY = 0) {
    this.bombPlaces = hitBomb ? this._initBombPlaces(difficulty, startX, startY) : this.bombPlaces = this._initBombPlaces(difficulty)
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

  _initBombPlaces(difficulty, startX = -1, startY = -1) {
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
    if (startX !== -1 || startY !== -1) {
      this.props.dispatch(init())
      this.setState({ board: this._initBoard(difficulty) }, () => {
        this._open(startX, startY)
      })
    }
    return bombPlaces
  }

  handleClick(e) {
    e.preventDefault()
    this._stopTimer(true)
    const { difficulty } = this.props
    this.props.dispatch(init())
    this.setState({ board: this._initBoard(difficulty) })
  }

  handleClickCell(x, y) {
    const { gameover, clear } = this.props
    const board = this.state.board
    if (gameover || clear || board[x][y].flagged) {
      return
    }
    this._open(x, y)
  }

  handleRightClickCell(x, y) {
    const { gameover, clear } = this.props
    console.log(this.state.board[x][y])
    if (gameover || clear || this.state.board[x][y].open) {
      return
    }
    this._toggleFlag(x, y)
  }

  handleDoubleClickCell(x, y) {
    const { gameover, clear, difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    const { board } = this.state
    let flags = 0
    if (gameover || clear) {
      return
    }
    if (board[x][y].flagged) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
          (j < 0 || j >= boardHeight) ||
          (i === x && j === y)) {
          continue
        }
        if (board[i][j].flagged) {
          flags++
        }
      }
    }
    if (board[x][y].bombCount !== flags) {
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
    const { difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        if (board[x][y].bomb) {
          board[x][y] = Object.assign({}, board[x][y], { open: true })
        }
      }
    }
    this.setState({ board }, () => {
      this.props.dispatch(gameover())
    })
  }

  _open(x, y, recursive = false) {
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
      if (!recursive && this.state.millis === 0 && (board[x][y].bomb || bombCount !== 0)) {
        this._initBoard(this.props.difficulty, true, x, y)
        return
      }
      board[x][y] = Object.assign({}, board[x][y], { open: true, bombCount: bombCount })
      this.setState({ board })
      if (board[x][y].flagged) {
        this._toggleFlag(x, y)
      }
      if (board[x][y].bomb) {
        this._stopTimer()
        this.showAllBombs(board)
        this.props._saveGame(this.state.millis, this.props.difficulty, false)
        return
      }
      if (this._isClear(board)) {
        this._stopTimer()
        this.props.dispatch(clear())
        this.props._saveGame(this.state.millis, this.props.difficulty, true)
        return
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
            this._open(i, j, recursive = true)
          }
        }
      }
    }
  }

  _isClear(board) {
    let openCount = 0
    const { difficulty } = this.props
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        }
      })
    })
    if (openCount === 1) {
      this._startTimer()
    }
    return openCount === (boardWidth * boardHeight - bombNum)
  }

  _toggleFlag(x, y) {
    const board = [].concat(this.state.board)
    const { flagged } = board[x][y]
    board[x][y] = Object.assign({}, board[x][y], { flagged: !flagged })
    this.setState({ board })
    this.props.dispatch(toggle(!flagged))
  }

  updateBoard = (difficulty) => {
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

  _startTimer = () => {
    let starttime = Date.now()
    this.setState({ gameIsRunning: true, starttime: starttime, millis: 0 })
    this.clock = setInterval(() => {
      let currenttime = Date.now()
      this.setState({ millis: currenttime - starttime })
    })
    //User now active
    const {userId, googleId, useremail} = this.props.credentials
    axios(REQUEST_FUNCTIONS.PUT_USER_ONLINE(userId, googleId, useremail, true))
  }

  _stopTimer = (reset = false) => {
    if (reset) {
      this.setState({ gameIsRunning: false, millis: 0 })
    } else {
      this.setState({ gameIsRunning: false })
    }
    clearInterval(this.clock)
    //User now inactive
    const {userId, googleId, useremail} = this.props.credentials
    axios(REQUEST_FUNCTIONS.PUT_USER_ONLINE(userId, googleId, useremail, false))
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

  changeDifficulty(e) {
    const difficulty = e.target.value
    this.props._updateDifficulty(difficulty)
    this.props.dispatch(changeDifficulty(difficulty))
    this.updateBoard(difficulty)
  }

  render() {
    const { board, gameIsRunning } = this.state
    const { difficulty, credentials } = this.props
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
      <div id="singleplayerdiv">
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
          <div id="menu">
            <button onClick={this.handleClick} id="restart">Restart</button>
            <select value={this.props.difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
              <option value={'easy'} key={'easy'}>Easy</option>
              <option value={'normal'} key={'normal'}>Normal</option>
              <option value={'hard'} key={'hard'}>Hard</option>
              <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
              <option value={'maniac'} key={'maniac'}>Maniac</option>
            </select>
            <span id="bomb"><GiFireBomb style={{ marginTop: -3 }} /> {this.props.bomb}</span>
          </div>
          <div id="gamehighscorewrapper">
            <Game
              board={board}
              cellSize={cellSize}
              difficulty={difficulty}
              boardWidthPx={boardWidthPx}
              handleClick={this.handleClick}
              handleClickCell={this.handleClickCell}
              handleRightClickCell={this.handleRightClickCell}
              handleDoubleClickCell={this.handleDoubleClickCell} />
            <HighscoreList
              highscores={credentials.highscores[difficulty]}
              highscoresloaded={credentials.highscores.loaded}
              credentials={this.props.credentials}
              difficulty={difficulty}
              isGlobalHighscoreList={false}
            />
            <HighscoreList
              highscores={credentials.globalhighscores[difficulty]}
              highscoresloaded={credentials.globalhighscores.loaded}
              credentials={this.props.credentials}
              difficulty={difficulty}
              isGlobalHighscoreList={true}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state.game

export default withRouter(connect(mapStateToProps)(SingleplayerGame))
