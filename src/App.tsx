import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { IUserCtx, UserContext } from './context/userContext';
import { Login } from './features/auth/Login';
import { Registration } from './features/auth/Registration';
import { GameIndex } from './features/game';
import { Home } from './features/map/home';
import { Map } from './features/map/map';
import { useUser } from './hooks/user.hook';
import { Footer } from './ui/footer';
import { Header } from './ui/header';
import { Private } from './utils/privateRoute';
import './stylesheet.css';

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
          <Route path="/game" element={
            <Private>
              <GameIndex />
            </Private>
          } />
          <Route path="/map/:id" element={
            <Private isProceedAnyway={true}>
              <>
                <Map />
              </>
            </Private>
          } />
          <Route path="/map" element={
            <Private>
              <Map />
            </Private>
          } />
        </Routes>
      </UserContext.Provider>
      {/* <Footer />*/}
    </>
  );
};
