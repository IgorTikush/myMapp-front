import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const navigate = useNavigate();

  const redirectToGame = (): void => {
    navigate('/game');
  };

  const redirectToMap = (): void => {
    navigate('/map');
  };

  return (
    <AppBar position={'static'} style={{ display: 'flex', flexDirection: 'row' }}>
      <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white', marginRight: 20 }}
        variant="outlined"
        onClick={redirectToGame}
      >
        Play a game
      </Button>
      <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={redirectToMap}
      >
        My map
      </Button>
    </AppBar>
  );
};
