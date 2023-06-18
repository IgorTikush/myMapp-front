import React, { Dispatch, SetStateAction } from 'react';

import { TGameStatus } from './types/game.types';

interface IGameOver {
  score: number;
  setGameStatus: Dispatch<SetStateAction<TGameStatus>>;
}

export const GameOver = (props: IGameOver): JSX.Element => {
  const { score, setGameStatus } = props;

  const retryGame = (): void => {
    setGameStatus('not-started');
  };

  return (
    <>
      Game is over!
      Your score is
      {' '}
      {score}
      {/* <button onClick={}>*/}
      {/*  Retry*/}
      {/* </button>*/}
      <button onClick={retryGame}>
        Retry
      </button>
    </>
  );
};

