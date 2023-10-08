import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../context/userContext';
import { useUser } from '../hooks/user.hook';

export const Header = (): JSX.Element => {
  const navigate = useNavigate();

  // const user = useUser();
  const { map: mapInfo, _id: userId } = useContext(UserContext);
  // console.log(user);
  const isUserRegistered = !!userId;

  const redirect = (path: string): void => {
    navigate(path);
  };

  return (
    <AppBar style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
      {isUserRegistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white', marginRight: 20 }}
        variant="outlined"
        onClick={(): void => redirect('/game')}
      >
        Play a game
      </Button> : null}
      {isUserRegistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={(): void => redirect(`/map/${mapInfo._id}`)}
      >
        My map
      </Button> : null}
      {!isUserRegistered ? <Button
        style={{ color: 'black', width: 200, backgroundColor: 'white' }}
        variant="outlined"
        onClick={(): void => redirect('/signup')}
      >
        Sign up
      </Button> : null}
    </AppBar>
  );
};
