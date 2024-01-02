import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BASE_API_URL } from './constants';
import { makeRequest } from './makeRequest';
import { UserContext } from '../context/userContext';
import { IUser } from '../features/auth/interfaces/user.interface';

export const AutoLogin = ({ children }: any): any => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    makeRequest({ url: `${BASE_API_URL}/user` })
      .then((userFromDb: IUser) => {
        if (!userFromDb) {
          // redirect('/');
        }

        setIsAuth(true);
        console.log('fromDB', userFromDb);
        updateUser(userFromDb);
      });
  }, []);

  if (isAuth) {
    navigate('/map');
  }

  return (
    <>
      {children}
    </>
  );
};
