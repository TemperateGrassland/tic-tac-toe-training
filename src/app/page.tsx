"use client"

import { useState } from "react";

// Next JS will render the export default function in page.tsx
// Game is the default export and has no inputs
// Hierachy of concepts One Game > One Board > 9 Squares

export default function Game() {
  // The game board is a collection of 9 squares.
  // Each square has a value of either 'X' or 'O'.
  // The game board tracks whose go it is next, the history of the moves, the current game state  and the current move.
  // 
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  const [currentMove, setCurrentMove] = useState(0);

function handlePlay(nextSquares) {
  // Called from the Board when the square is clicked, input is the updated game state from the after the current move has been played 
  console.log(currentMove);
  console.log(history) 
  // array slice operations 'end' parameter is exclusive
  // Get the initial game state and add the updated game state to nextHistory
  const nexthistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nexthistory);
  // set current move number based on the nextHistory array length 
  setCurrentMove(nexthistory.length - 1);
  // Flip the boolean indicating whose turn it is
  setXIsNext(!xIsNext);
}

function jumpTo(nextMove) {
  setCurrentMove(nextMove);
  setXIsNext(nextMove % 2 === 0);
}

const moves = history.map((squares, move) => {
  let description;
  if (move > 0) {
    description = 'Go to move #' + move;
  } else {
    description = 'Go to game start';
  }
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});

  return (
    <div className="game">
      <div className="game-board">
        {/* Pass only one game state to be rendered by the board - the current game state
        The board also accepts the next user var in order to display it 
        onPlay is a callback function to update the game state by passing the function to the board and then calling that function to update the state values stored in the Game*/}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    // Handles the click of a square and checks if there is a winnner, copies the game state and updates the game state
    // Calls function to handle the updates to the state stored in the Game


    // return early if square is already filled or one player has won the game
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // Create a copy of the current array representing the game state
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  
  return(
  <> 
  {/* Renders a message with the current game status and a board of a 3x3 grid  */}
  {/* The value of each square is stored in the squares array and passed to the Square component  */}
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
      <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
      <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
    </div>
  </>
  );
}


function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
