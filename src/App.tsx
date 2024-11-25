import React from 'react';
import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [opponentCount, setOpponentCount] = React.useState(0);

  const handleStartGame = (count: number) => {
    setOpponentCount(count);
    setGameStarted(true);
  };

  return (
    <GameProvider initialOpponents={opponentCount}>
      {!gameStarted ? (
        <WelcomeScreen onStartGame={handleStartGame} />
      ) : (
        <GameBoard />
      )}
    </GameProvider>
  );
}

export default App;