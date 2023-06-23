import React from 'react';
import { render, fireEvent, waitFor, queryAllByTestId } from '@testing-library/react';
import Game from '../Game';

describe('Game component', () => {
  it('symbol selection, square click, computer move, winning pattern, restart', async () => {

    const winningSquares = ['X', 'X', '', '', '', '', 'O', 'O', 'O']; // Board with win condition
    const { getByText, getByTestId, rerender } = render(<Game/>);

    // Symbol selection, check that player is X
    const xButton = getByText('X');
    fireEvent.click(xButton);
    await waitFor(() => expect(getByText('Next Player: X')).toBeInTheDocument());

    // Clicking a square, check updated board to have an X at square 0
    const square0 = getByTestId('square-0');
    fireEvent.click(square0);
    expect(square0.textContent).toBe('X');

    // CPU move, check updated board to O at square 1
    fireEvent.click(getByTestId('square-1'));
    await waitFor(() => expect(getByTestId('square-1').textContent).toBe('O'));

    // Load board with winning condition
    rerender(
      <Game
        initialSquares={winningSquares}
        initialPlayerSymbol="X"
        initialComputerSymbol="O"
      />
    );

    // Check for winning text
    await waitFor(() => {
        const statusElement = getByText('Winner: O');
        expect(statusElement).toBeInTheDocument();
      });

    // Restart, check empty squares
    fireEvent.click('Restart');
    await waitFor(() => {
      const squares = queryAllByTestId(/square-\d/);
      const isEmpty = squares.every((square) => square.textContent === '');
      expect(isEmpty).toBe(true);
    });
  });
});
