import { Routes, Route, redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Registration } from './features/auth/Registration';
import { Footer } from './ui/footer';
import { IUser } from './features/auth/interfaces/user.interface';
import { UserContext, userDefault } from './context/userContext';
import { BASE_API_URL } from './utils/constants';
import { makeRequest } from './utils/makeRequest';
import { Login } from './features/auth/Login';
import { Welcome } from './features/auth/Welcome';

export const App = () => {
  const [user, setUser] = useState<IUser>(userDefault);

  useEffect(() => {
    makeRequest({ url: `${BASE_API_URL}/user` })
      .then((userFromDb: IUser) => {
        if (!userFromDb) {
          redirect('/');
        }

        setUser(userFromDb);
      });
  }, [])

  return (
    <>
      <UserContext.Provider value={user}>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Registration />} />
          <Route path="/signin" element={<Login />} />
          <Route index element={<Registration />} />
          {/* Private routes */}
          <Route path="/welcome" element={user.email && <Welcome />} />
        </Routes>
      </UserContext.Provider>
      <Footer />
    </>
  );
}
