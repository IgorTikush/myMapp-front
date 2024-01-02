import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { IUserCtx, UserContext } from './context/userContext';
import { Login } from './features/auth/Login';
import { Registration } from './features/auth/Registration';
import { GameIndex } from './features/game';
import { Landing } from './features/landing';
import { Home } from './features/map/home';
import { Mapp } from './features/map/mapp';
import { useUser } from './hooks/user.hook';
import { AutoLogin } from './utils/autoLogin';
import { Private } from './utils/privateRoute';
import './stylesheet.css';

export const App = (): JSX.Element => {
  const user: IUserCtx = useUser();

  return (
    <>
      <UserContext.Provider value={user}>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={
            <AutoLogin>
              <Registration />
            </AutoLogin>
          } />
          <Route path="/signin" element={
            <AutoLogin>
              <Login />
            </AutoLogin>
          } />
          <Route index element={
            <AutoLogin>
              <Landing />
            </AutoLogin>
          } />
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
                <Mapp />
              </>
            </Private>
          } />
          <Route path="/map" element={
            <Private>
              <Mapp />
            </Private>
          } />
        </Routes>
      </UserContext.Provider>
      {/* <Footer />*/}
    </>
  );
};
