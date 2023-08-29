import React, { useState } from 'react';

import { GameLogic } from './game-logic';
import { GameOver } from './game-over';
import { TGameStatus } from './types/game.types';

export const GameIndex = (): JSX.Element => {
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<TGameStatus>('not-started');

  const startGame = () => {
    setGameStatus('in-progress');
  };

  if (gameStatus === 'in-progress') {
    return <GameLogic score={score} setScore={setScore} setGameStatus={setGameStatus} />;
  }

  if (gameStatus === 'finished') {
    return <GameOver score={score} setGameStatus={setGameStatus} />;
  }

  return (
    <div style={{ display: 'flex', height: 30, paddingTop: 100, flexWrap: 'wrap', justifyContent: 'center' }}>
      <button onClick={startGame}>
        Start
      </button>
    </div>
  );
};
