import React, { PureComponent } from 'react'
import {FaFlag} from 'react-icons/fa'
import {GiFireBomb} from 'react-icons/gi'
import '../styles/Cell.css'

const baseStyle = {
  width: 32,
  height: 32,
  border: 'outset 4px white',
  lineHeight: '32px',
  userSelect: 'none'
}

const openStyle = {
  width: 38,
  height: 38,
  lineHeight: '38px',
  border: 'solid 1px darkgray'
}

export default class Cell extends PureComponent {
  constructor(props) {
    super(props)
    this._handleClick = this._handleClick.bind(this)
    this._handleDoubleClick = this._handleDoubleClick.bind(this)
    this._handleRightClick = this._handleRightClick.bind(this)
  }

  _handleClick(e) {
    e.preventDefault()
    this.props.onClick(this.props.x, this.props.y)
  }

  _handleDoubleClick(e) {
    e.preventDefault()
    this.props.onDoubleClick(this.props.x, this.props.y)
  }

  _handleRightClick(e) {
    e.preventDefault()
    this.props.onRightClick(this.props.x, this.props.y)
  }

  render() {
    let content = this.props.cell.flagged ? <FaFlag /> : ''
    let style = Object.assign({}, baseStyle, {
      width: this.props.cellSize,
      height: this.props.cellSize,
      lineHeight: `${this.props.cellSize-12}px`,
    })
    if (this.props.cell.open) {
      style = Object.assign({}, style, openStyle, {
        width: this.props.cellSize ,
        height: this.props.cellSize ,
        lineHeight: `${this.props.cellSize -2}px`
      })
      if (this.props.cell.bomb) {
        content = <GiFireBomb style={{ marginTop: -4 }} />
        style = Object.assign({}, style, { backgroundColor: 'red' })
      } else {
        if (this.props.cell.bombCount > 0) {
          content = this.props.cell.bombCount
          switch (content) {
            case 1:
              style = Object.assign({}, style, { color: 'blue' })
              break
            case 2:
              style = Object.assign({}, style, { color: 'green' })
              break
            case 3:
              style = Object.assign({}, style, { color: 'red' })
              break
            case 4:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 5:
              style = Object.assign({}, style, { color: 'darkred' })
              break
            case 6:
              style = Object.assign({}, style, { color: 'deepskyblue' })
              break
            case 7:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 8:
              style = Object.assign({}, style, { color: 'gray' })
              break
            default:
              break
          }
        } else {
          content = ''
        }
      }
    }
    return (
      <div
        className="cell"
        style={style}
        onClick={this._handleClick}
        onDoubleClick={this._handleDoubleClick}
        onContextMenu={this._handleRightClick}
      >
        {content}
      </div>
    )
  }
}
