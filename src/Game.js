//game.js file


import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game = () => {

  /* 
  useState() for 
  -Game board squares
  -Track the player's turn
  -Which symbol the player chose
  -Computer's chosen symbol
  -Winner of the game
  -Showing the the symbol selection option
  */
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [isPlayerX, setIsPlayerX] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [computerSymbol, setComputerSymbol] = useState('');
  const [winner, setWinner] = useState(null);
  const [showSymbolSelection, setShowSymbolSelection] = useState(true);

  //useEffect to check for winner after every turn based on squares
  useEffect(() => {

    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], //cols
      [0, 4, 8], [2, 4, 6] //diagonals
    ];


    //check for winning combos
    const checkWinner = () => {
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          setWinner(squares[a]);
          break;
        }
      }
    };

    checkWinner();

    //CPU logic, check for no winner, CPU's turn, and if symbols have been selected
    if (!winner && isPlayerX === false && playerSymbol !== '' && computerSymbol !== '') 
    {
      //reduce func to check available squares
      const availableSquares = squares.reduce((acc, curr, index) => {
        if (!curr) 
        {
          return [...acc, index];
        }
        return acc;
      }, []);

      //Computer's move
      if (availableSquares.length > 0) 
      {
        const randomIndex = Math.floor(Math.random() * availableSquares.length);
        const computerChoice = availableSquares[randomIndex];
        const updatedSquares = [...squares];
        
        updatedSquares[computerChoice] = computerSymbol;
        setSquares(updatedSquares);
        setIsPlayerX(true);
      }
    }
  }, squares);

  const handleClick = (index) => {
    //Check for square is occupied, for winner, and for symbol selection.
    if (squares[index] || winner || playerSymbol === '' || computerSymbol === '') 
    {
      return;
    }
    const updatedSquares = [...squares];
    updatedSquares[index] = playerSymbol;
    setSquares(updatedSquares);
    setIsPlayerX(!isPlayerX);
    setShowSymbolSelection(false);
  };

//Restart button
const handleRestart = () => {
  setSquares(Array(9).fill(''));
  setIsPlayerX(true);
  setWinner(null);
  setPlayerSymbol('');
  setComputerSymbol('');
  setShowSymbolSelection(true);
};

  //Select symbol
  const handleSymbolChange = (symbol) => {
    if (symbol === 'X') {
      setPlayerSymbol('X');
      setComputerSymbol('O');
    } else {
      setPlayerSymbol('O');
      setComputerSymbol('X');
    }
  };

  const isBoardFull = squares.every((square) => square !== '');

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull) {
    status = "It's a draw!";
  } else {
    status = `Next Player: ${isPlayerX ? playerSymbol : computerSymbol}`;
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe by Younis</h1>
      {showSymbolSelection ? (
        <div className="symbol-selection">
          <span>Select your symbol: </span>
          <button className="symbol-button" onClick={() => handleSymbolChange('X')}>
            X
          </button>
          <button className="symbol-button" onClick={() => handleSymbolChange('O')}>
            O
          </button>
        </div>
      ) : null}
      <div className="status">{status}</div>
      <Board squares={squares} onClick={handleClick} />
      <button className="restart" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
};

export default Game;


//unused sleep function
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
