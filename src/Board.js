import React from 'react';
import './Board.css';

const Board = ({ squares, onClick }) => {
  return (
    <div className="board" data-testid="board">
      {squares.map((value, index) => (
        <div key={index} className="square" data-testid={`square-${index}`} onClick={() => onClick(index)}>
          {value}
        </div>
      ))}
    </div>
  );
};

export default Board;

