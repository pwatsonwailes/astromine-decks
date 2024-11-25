import React from 'react';
import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const [gameStarted, setGameStarted] = React.useState(false);

  return (
    <GameProvider>
      {!gameStarted ? (
        <WelcomeScreen onStartGame={() => setGameStarted(true)} />
      ) : (
        <GameBoard />
      )}
    </GameProvider>
  );
}

export default App;