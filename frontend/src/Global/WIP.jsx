import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '../Navbar/Navbar.jsx';

const WIP = ({ text = 'Work in Progress' }) => {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          bgcolor: '#fff',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 3, marginTop: '-18px' },
        }}
      >
        <Typography variant="h4" color="text.primary" textAlign="center">
          {text}
        </Typography>
      </Box>
    </>
  );
};

export default WIP;