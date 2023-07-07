import React, { useState, useEffect } from 'react';
import Board from './Board';
import { getRandomMove } from './aiLogic';

const Game = () => {

  const BOARD_IS = Array(9).fill('')
  const X_SYMBOL = 'X'
  const O_SYMBOL = 'O'
  const RANDOM_NUM_FIRST_TURN = Math.random() < 0.5 
  
  /* 
  useState() for 
  -Game board squares
  -Track the player's turn
  -Which symbol the player chose
  -Winner of the game
  -Showing the the symbol selection option
  -RestartConfirmation(requires two clicks for mid game)
  -Track the number of turns
  */
  const [squares, setSquares] = useState(BOARD_IS);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [winner, setWinner] = useState(null);
  const [showSymbolSelection, setShowSymbolSelection] = useState(true);
  const [restartConfirmation, setRestartConfirmation] = useState(false);
  const [turnCount, setTurnCount] = useState(0); 


  const checkWinner = (symbol) => {

    const dimension = Math.sqrt(squares.length);
    //Iterate over rows and columns
    for (let i = 0; i < dimension; i++) 
    {
      const row = [];
      const column = [];
      //Calculate indices and populate corresponding arrays 
      for (let j = 0; j < dimension; j++) 
      {
        row.push(squares[i * dimension + j]);
        column.push(squares[j * dimension + i]);
      }
      //every() checks if all the elements in the array are equal which is a winning combo
      if (row.every((value) => value === symbol) || 
          column.every((value) => value === symbol)) 
      {return true;}
    }

    //Same thing with diagonals. No need to nest inside the top loop.
    const mainDiagonal = [];
    const secondaryDiagonal = [];
    for (let i = 0; i < dimension; i++) 
    {
      mainDiagonal.push(squares[i * (dimension + 1)]);
      secondaryDiagonal.push(squares[(i + 1) * (dimension - 1)]);
    }

    if (mainDiagonal.every((value) => value === symbol) ||
       secondaryDiagonal.every((value) => value === symbol)) 
    {return true;}

    return false; //No winning combos
  };
  
  //useEffect to check for winner after enough turns have been made
  useEffect(() => {
    
    //CPU logic, check for no winner, CPU's turn, and if symbols have been selected
    if (!winner && !isPlayerTurn && playerSymbol !== '' && computerSymbol !== '') 
    {
      //Reduce function to check for available squares
      const availableSquares = squares.reduce((OpenSquares, CurrentSquare, CurrentSquareIndex) => {
        if (!CurrentSquare) 
        {
          return [...OpenSquares, CurrentSquareIndex];
        }
        return OpenSquares;
      }, []);

      //Computer's move, pass available squares into getRandomMove
      if (availableSquares.length > 0) 
      {
        const aiMove = getRandomMove(availableSquares);
        const updatedSquares = [...squares];
        updatedSquares[aiMove] = computerSymbol;
        setSquares(updatedSquares);
        setIsPlayerTurn(true);
      }
    }
    
    const dimension = Math.sqrt(squares.length);
    const MIN_TURNS_FOR_WIN = (dimension * 2) - 1 //5
    setTurnCount((prevTurnCount) => prevTurnCount + 1);

    //Check for winner and setWinner. Only check if enough turns have been made
    if(turnCount >= MIN_TURNS_FOR_WIN)
    {
    if (checkWinner(playerSymbol)) {setWinner(playerSymbol);} 
    else if (checkWinner(computerSymbol)) {setWinner(computerSymbol);}
    }

  }, [squares, isPlayerTurn]);

  const handleClick = (index) => {
    //Check for square is occupied, for winner, and for symbol selection.
    if (squares[index] || winner || playerSymbol === '' || computerSymbol === '') 
    {
      return;
    }
    const updatedSquares = [...squares];
    updatedSquares[index] = playerSymbol;
    setSquares(updatedSquares);
    setIsPlayerTurn(!isPlayerTurn);
    setShowSymbolSelection(false);
  };

//Restart button. Prompts "are you sure?" if mid game
const handleRestart = () => {
  if (isBoardFull || winner || restartConfirmation) {
    setSquares(BOARD_IS);
    setIsPlayerTurn(true);
    setWinner(null);
    setPlayerSymbol('');
    setShowSymbolSelection(true);
    setRestartConfirmation(false);
    setTurnCount(0)
  } else {
    setRestartConfirmation(true);
  }
};

  //Select symbol and display user selection
  const handleSymbolChange = (symbol) => {
    setPlayerSymbol(symbol === X_SYMBOL ? X_SYMBOL : O_SYMBOL);
    setIsPlayerTurn(RANDOM_NUM_FIRST_TURN); // Randomize the first turn
    setShowSymbolSelection(false);
  };

  const computerSymbol = playerSymbol === X_SYMBOL ? O_SYMBOL : X_SYMBOL;
  const isBoardFull = squares.every((square) => square !== '');

  let status;
  if (winner) {status = `Winner: ${winner}`;} 
  else if (isBoardFull) {status = "It's a draw!";} 
  else {status = `Next Player: ${isPlayerTurn ? playerSymbol : computerSymbol}`;}

  return (
    <div className="game">
      <h1>Tic Tac Toe by Younis</h1>
      {showSymbolSelection ? (
        <div className="symbol-selection">
          <span>Select your symbol: </span>
          <button className="symbol-button" onClick={() => handleSymbolChange(X_SYMBOL)}>
            X
          </button>
          <button className="symbol-button" onClick={() => handleSymbolChange(O_SYMBOL)}>
            O
          </button>
        </div>
      ) : (
        <div className="symbol-selection">
          <span>You selected symbol: </span>
          <span>{playerSymbol}</span>
        </div>
      )}
      <div className="status">{status}</div>
      <Board squares={squares} onClick={handleClick} />
      <button className="restart" onClick={handleRestart}>
        {restartConfirmation ? 'Are you sure?' : 'Restart'}
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
