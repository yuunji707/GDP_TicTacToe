import React from 'react';
import { render, queryAllByText, fireEvent, getByTestId } from '@testing-library/react';
import Board from '../Board';

describe('Board component', () => {
  const squares = ['X', 'O', '', '', '', '', '', '', ''];

  it('displays the correct symbols in the squares', () => {
    const { container } = render(<Board squares={squares} />);
    const xSquares = queryAllByText(container, 'X');
    const oSquares = queryAllByText(container, 'O');

    expect(xSquares.length).toBe(1);
    expect(oSquares.length).toBe(1);
  });

  it('calls the onClick function when a square is clicked', () => {
    const squares = ['', '', '', '', '', '', '', '', ''];
    const onClick = jest.fn();
    const { container } = render(<Board squares={squares} onClick={onClick} />);
    const emptySquare = getByTestId(container, 'square-0');

    fireEvent.click(emptySquare);
    expect(onClick).toHaveBeenCalledWith(0);
  });
});

