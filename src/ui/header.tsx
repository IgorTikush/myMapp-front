import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const navigate = useNavigate();

  const redirectToGame = (): void => {
    navigate('/game');
  };

  return (
    <AppBar position={'static'}>
      <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={redirectToGame}
      >
        Play a game
      </Button>
    </AppBar>
  );
};
