import React, { Component } from 'react'
import Board from './Board'

export class Game extends Component {

    render() {
        return (
            <div id="game" style={{ width: this.props.boardWidthPx}}>
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
