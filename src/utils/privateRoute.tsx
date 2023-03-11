import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from '../context/userContext';

export const Private = (Component: JSX.Element) => {
  const user = useContext(UserContext);
  console.log('user: ', user);
  if (!user.email) {

  }

  return user.email ? Component : <Navigate to='/' />;
}
