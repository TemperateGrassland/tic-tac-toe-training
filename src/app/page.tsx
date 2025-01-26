"use client"

import { useState } from "react";

// Next JS will render the export default function in page.tsx
// Game is the default export and has no inputs
// Hierachy of concepts One Game > One Board > 9 Squares

export default function Game() {
  // The game board is a collection of 9 squares.
  // Each square has a value of either 'X' or 'O'.
  // The game board tracks whose go it is next, the history of the moves, the current game state  and the current move.
  // The history of the game state and the current state are the main data arrays involved in keeping track of the game

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscendingOrder, setIsAscendingOrder] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares) {
    // Called from the Board when the square is clicked, input is the updated game state from the after the current move has been played 
    console.log(currentMove);
    console.log(history) 
    // array slice operations 'end' parameter is exclusive
    // Get the initial game state and add the updated game state to nextHistory
    const nexthistory = [...history.slice(0, currentMove + 1), nextSquares];
    console.log(nexthistory);
    setHistory(nexthistory);
    // set current move number based on the nextHistory array length 
    setCurrentMove(nexthistory.length - 1);
    // Flip the boolean indicating whose turn it is
  }

  function jumpTo(nextMove) {
    // Called from the list of moves, input is the move number to jump to
    // set the current move to whatever the user specified
    // How does the jumpTo function re-render the board?
    setCurrentMove(nextMove);
  }

  function sortResults() {
    // sort the list of moves made by ascending or descending order

    setIsAscendingOrder(!isAscendingOrder);
  }

  const moves = history.map((squares, move) => {
    console.log("move", move);
    console.log("squares", squares);
    let description;
    if (move === currentMove) {
      return(
        <p>You are at move #{currentMove}</p>
      ); 
    } 
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    
    return (
      <li key={move}>
        {/* When the button for the relevant game state is clicked, jumpTo is called */}
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
    <div className="game">
      <div className="game-board">
        {/* Pass only one game state to be rendered by the board - the current game state
        The board also accepts the next user var in order to display it 
        onPlay is a callback function to update the game state by passing the function to the board and then calling that function to update the state values stored in the Game*/}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <MoveList moves={moves} isAscendingOrder={isAscendingOrder}/>
      </div>
      <div className="order-button">
        <button onClick={() => sortResults()}>{'Change the order of the moves'}</button>
      </div>
    </div>
    </>
  );
}

function MoveList({moves, isAscendingOrder}) {
  if (isAscendingOrder) { 
    return (
      <ol>{moves}</ol>
    )
  return (
    <ol>{moves}</ol>
  );
}
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
    // Trigger a re-render of the Game (and all other) component(s).
    onPlay(nextSquares);
  }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  
  // Dynamically create rows and squares using loops
  const grid = [];
  for (let row = 0; row < 3; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col; // Calculate the index for the square
      cells.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    grid.push(
      <div key={row} className="board-row">
        {cells}
      </div>
    );
  }

  return (
    // Make edits to the board UI here
    <>
      {/* Display the game status */}
      <div className="status">{status}</div>
      {/* Render the dynamically generated grid */}
      {grid}
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
