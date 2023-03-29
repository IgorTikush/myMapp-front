import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/userContext';

export const Home = (): JSX.Element => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.map._id) {
      console.log('in home');
      console.log(user);
      navigate(`/map/${user.map._id}`);
    }
  }, []);

  return (
    <div />
  );
};
