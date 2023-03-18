import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { IUserCtx, UserContext } from './context/userContext';
import { Login } from './features/auth/Login';
import { Registration } from './features/auth/Registration';
import { Welcome } from './features/auth/Welcome';
import { Home } from './features/map/home';
import { useUser } from './hooks/user.hook';
import { Footer } from './ui/footer';
import { Private } from './utils/privateRoute';

export const App = (): JSX.Element => {
  const user: IUserCtx = useUser();

  return (
    <>
      <UserContext.Provider value={user}>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Registration />} />
          <Route path="/signin" element={<Login />} />
          <Route index element={<Registration />} />
          {/* Private routes */}
          <Route path="/home" element={
            <Private>
              <Home />
            </Private>
          } />
          <Route path="/maps/:id" element={<Welcome />} />
        </Routes>
      </UserContext.Provider>
      <Footer />
    </>
  );
};
