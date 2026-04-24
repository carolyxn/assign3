import * as React from 'react'

function Square({ value, onClick, isSelected }) {
  const className = isSelected ? 'square selected-square' : 'square'
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({ squares, onClick, selectedIndex }) {
  function renderSquare(index) {
    return (
      <Square
        value={squares[index]}
        onClick={() => onClick(index)}
        isSelected={selectedIndex === index}
      />
    )
  }

  return (
    <>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  )
}

function calculateWinner(squares) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < winLines.length; i += 1) {
    const a = winLines[i][0]
    const b = winLines[i][1]
    const c = winLines[i][2]
    if (squares[a] !== null && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function getPieceIndexes(squares, playerSymbol) {
  const indexes = []
  for (let i = 0; i < squares.length; i += 1) {
    if (squares[i] === playerSymbol) {
      indexes.push(i)
    }
  }
  return indexes
}

function isAdjacent(source, destination) {
  const fromRow = Math.floor(source / 3)
  const fromCol = source % 3
  const toRow = Math.floor(destination / 3)
  const toCol = destination % 3

  const rowDiff = Math.abs(fromRow - toRow)
  const colDiff = Math.abs(fromCol - toCol)
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)
}

export default function App() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = React.useState(true)
  const [selectedSquare, setSelectedSquare] = React.useState(null)

  const winner = calculateWinner(squares)
  const currentPlayer = xIsNext ? 'X' : 'O'
  const currentPlayerPieces = getPieceIndexes(squares, currentPlayer)
  const isPlacementPhase = currentPlayerPieces.length < 3

  function endTurn(nextSquares) {
    setSquares(nextSquares)
    setXIsNext((previous) => !previous)
    setSelectedSquare(null)
  }

  function handleSquareClick(index) {
    if (winner) {
      return
    }

    const nextSquares = squares.slice()

    if (isPlacementPhase) {
      if (nextSquares[index] !== null) {
        return
      }
      nextSquares[index] = currentPlayer
      endTurn(nextSquares)
      return
    }

    if (selectedSquare === null) {
      if (nextSquares[index] === currentPlayer) {
        setSelectedSquare(index)
      }
      return
    }

    if (index === selectedSquare) {
      setSelectedSquare(null)
      return
    }

    if (nextSquares[index] === currentPlayer) {
      setSelectedSquare(index)
      return
    }

    if (nextSquares[index] !== null) {
      setSelectedSquare(null)
      return
    }

    if (!isAdjacent(selectedSquare, index)) {
      setSelectedSquare(null)
      return
    }

    const ownsCenter = currentPlayerPieces.includes(4)
    const movedFromCenter = selectedSquare === 4
    nextSquares[selectedSquare] = null
    nextSquares[index] = currentPlayer
    const moveWins = calculateWinner(nextSquares) === currentPlayer

    if (ownsCenter && !movedFromCenter && !moveWins) {
      setSelectedSquare(null)
      return
    }

    endTurn(nextSquares)
  }

  function resetGame() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setSelectedSquare(null)
  }

  let statusText
  if (winner) {
    statusText = `Winner: ${winner}`
  } else if (isPlacementPhase) {
    statusText = `Next player: ${currentPlayer} (place a piece)`
  } else if (selectedSquare === null) {
    statusText = `Next player: ${currentPlayer} (select a piece to move)`
  } else {
    statusText = `Next player: ${currentPlayer} (move to adjacent empty square)`
  }

  return (
    <div className="container py-4">
      <h1>Chorus Lapilli</h1>
      <div className="status">{statusText}</div>
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={handleSquareClick} selectedIndex={selectedSquare} />
        </div>
      </div>
      <button className="mt-3 btn btn-secondary btn-sm" onClick={resetGame}>
        Reset game
      </button>
    </div>
  )
}
