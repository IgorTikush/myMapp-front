import Button from '@mui/material/Button';
import React from 'react';

export const headerButton = (redirectFunction: () => void, text: string) => (
  <Button
    style={{ color: 'black', width: 200, backgroundColor: 'white', marginTop: 10, marginLeft: 20}}
    variant="outlined"
    onClick={redirectFunction}
  >
    {text}
  </Button>
)
