import { Button } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/userContext';

export const Home = (): JSX.Element => {
  const { map } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (map._id) {

      navigate(`maps/${map._id}`);
    }
  },[]);

  return (
    <Button>
      myMap
    </Button>
  );
};
