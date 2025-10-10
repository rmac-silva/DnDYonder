import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import BookIcon from '@mui/icons-material/Book';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ShareIcon from '@mui/icons-material/Share';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';

/// The homepage component

function Homepage() {
     const { isLoggedIn,email } = useAuth();

    return (
    <>
      <Navbar />

      <Box className=" bg-gradient-to-b py-12">
        <Container maxWidth="lg">
          {/* Hero */}
          <Paper elevation={1} className="p-8 md:p-12 rounded-lg">
            {/* Use CSS Grid via Box instead of Grid item/props (avoids MUI v6 warnings) */}
            <Box
              sx={{
                display: 'grid',
                gap: 4,
                alignItems: 'center',
                gridTemplateColumns: { xs: '1fr', md: '' },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  className="font-extrabold text-3xl md:text-5xl text-gray-900 mb-4"
                >
                  Build and manage your DnD characters
                </Typography>
                <Typography variant="body1" className="text-gray-700 !mb-6 font-bold !text-xl">
                  Create, track, and share character sheets with intuitive controls and focused tools.
                  Lightweight, fast, and tailored for tabletop play.
                </Typography>

                <Stack direction="row" spacing={2} className="flex-wrap">
                  {!isLoggedIn && (
                    <div className="flex space-x-4">
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        color="primary"
                        className="!px-6 !py-2 !text-lg"
                      >
                        Login
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="outlined"
                        color="primary"
                        className="!px-6 !ml-4 !py-2 !text-lg"
                      >
                        Register
                      </Button>
                    </div>
                  )}

                  {isLoggedIn && (
                    <Button
                      component={RouterLink}
                      to={`/sheets/${email}`}
                      variant="outlined"
                      color="primary"
                      className="!px-6 !py-2 !text-lg"
                    >
                      View Sheets
                    </Button>
                  )}
                </Stack>
              </Box>

              
            </Box>
          </Paper>

          {/* (You can re-add features/cards below — avoid Grid item/props and use Box/CSS grid similarly) */}
        </Container>
      </Box>
    </>
    
    )
}

export default Homepage