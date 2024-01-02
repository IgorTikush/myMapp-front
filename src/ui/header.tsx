import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../context/userContext';
import { useUser } from '../hooks/user.hook';
import { headerButton } from './styles/header';

export const Header = (): JSX.Element => {
  const navigate = useNavigate();

  // const user = useUser();
  const { map: mapInfo, _id: userId } = useContext(UserContext);
  // console.log(user);
  const isUserRegistered = !!userId;
  let isOnOwnMap = false;

  if (window.location.pathname.includes('/map')) {
    const currentMapId = window.location.pathname.split('/').pop();
    if (currentMapId === mapInfo._id) {
      isOnOwnMap = true;
    }
  }

  console.log(window.location.pathname);
  const redirect = (path: string): void => {
    navigate(path);
  };

  return (
    <AppBar style={{ display: 'flex', flexDirection: 'row', position: 'absolute', backgroundColor: 'transparent', boxShadow: 'none' }}>
      {isUserRegistered ? headerButton(() => redirect('/game'), 'Play game') : null}
      {(isUserRegistered && !isOnOwnMap) ? headerButton(() => redirect(`/map/${mapInfo._id}`), 'My map') : null}
      {!isUserRegistered ? headerButton(() => redirect('/signup'), 'Sign up') : null}
    </AppBar>
  );
};
