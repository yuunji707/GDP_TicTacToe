export function getRandomMove(availableSquares) {
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    return availableSquares[randomIndex];
  }