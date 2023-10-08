import React, { useContext, useEffect, useState } from 'react';

import { BASE_API_URL } from './constants';
import { makeRequest } from './makeRequest';
import { UserContext } from '../context/userContext';
import { IUser } from '../features/auth/interfaces/user.interface';
import { Header } from '../ui/header';

export const Private = ({ children }: any): JSX.Element => {
  const [showComponent, setShowComponent] = useState<boolean>(false);

  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    makeRequest({ url: `${BASE_API_URL}/user` })
      .then((userFromDb: IUser) => {
        if (!userFromDb) {
          // redirect('/');
        }

        setShowComponent(true);
        console.log('fromDB', userFromDb);
        updateUser(userFromDb);
      });
  }, []);

  if (showComponent) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  return (
    <>
      oshibka
    </>
  );
};
