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
import COLORS from '../constants/colors.js';

/// The homepage component

function Homepage() {
     const { isLoggedIn,authUsername } = useAuth();

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
                  className="font-extrabold text-3xl md:text-5xl mb-4"
                  style={{color: COLORS.secondary}}
                >
                  Build and manage your DnD characters
                </Typography>
                <Typography variant="body1" className="!mb-6 font-bold !text-xl" style={{color: COLORS.secondary}}>
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
                        className="!px-6 !py-2 !text-lg"
                        sx={{
                            backgroundColor: COLORS.accent,
                            color: COLORS.primary,
                            '&:hover': {
                                backgroundColor: COLORS.accentHover,
                            },
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="outlined"
                        className="!px-6 !ml-4 !py-2 !text-lg"
                        sx={{
                            borderColor: COLORS.accent,
                            color: COLORS.accent,
                            '&:hover': {
                                borderColor: COLORS.accentHover,
                                backgroundColor: COLORS.primary,
                            },
                        }}
                      >
                        Register
                      </Button>
                    </div>
                  )}

                  {isLoggedIn && (
                    <Button
                      component={RouterLink}
                      to={`/sheets/${authUsername}`}
                      variant="outlined"
                      className="!px-6 !py-2 !text-lg"
                      sx={{
                          borderColor: COLORS.accent,
                          color: COLORS.accent,
                          '&:hover': {
                              borderColor: COLORS.accentHover,
                              backgroundColor: COLORS.primary,
                          },
                      }}
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