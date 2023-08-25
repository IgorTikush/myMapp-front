import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ isForUnregistered = false }): JSX.Element => {
  const navigate = useNavigate();

  const redirect = (path: string): void => {
    navigate(path);
  };

  return (
    <AppBar style={{ display: 'flex', flexDirection: 'row' }}>
      {!isForUnregistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white', marginRight: 20 }}
        variant="outlined"
        onClick={(): void => redirect('/game')}
      >
        Play a game
      </Button> : null}
      {!isForUnregistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={(): void => redirect('/map')}
      >
        My map
      </Button> : null}
      {isForUnregistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={(): void => redirect('/signup')}
      >
        Sign up
      </Button> : null}
    </AppBar>
  );
};
