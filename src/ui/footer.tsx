import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as React from 'react';

export const Footer = (props: any): JSX.Element => (
  <div style={{ bottom: 0, position: 'fixed', width: '100%' }}>
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  </div>
);
