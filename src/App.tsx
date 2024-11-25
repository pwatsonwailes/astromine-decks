import React from 'react';
import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App;