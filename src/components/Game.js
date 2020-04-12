import React, { Component } from 'react'
import {GiFireBomb} from "react-icons/gi"
import Board from './Board'
import {changeDifficulty} from '../actions'

export class Game extends Component {

    changeDifficulty(e) {
        const difficulty = e.target.value
        this.props.dispatch(changeDifficulty(difficulty))
        this.props.updateBoard(difficulty)
    }

    render() {
        return (
            <div id="game" style={{ width: this.props.boardWidthPx }}>
                <div id="menu">
                    <button onClick={this.props.handleClick} id="restart">Restart</button>
                    <select value={this.props.difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
                        <option value={'easy'} key={'easy'}>Easy</option>
                        <option value={'normal'} key={'normal'}>Normal</option>
                        <option value={'hard'} key={'hard'}>Hard</option>
                        <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
                        <option value={'maniac'} key={'maniac'}>Maniac</option>
                    </select>
                    <span id="bomb"><GiFireBomb style={{ marginTop: -3 }} /> {this.props.bomb}</span>
                </div>
                <Board
                    board={this.props.board}
                    cellSize={this.props.cellSize}
                    onClick={this.props.handleClickCell}
                    onRightClick={this.props.handleRightClickCell}
                    onDoubleClick={this.props.handleDoubleClickCell}
                />
            </div>
        )
    }
}

export default Game
