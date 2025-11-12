import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth/AuthContext';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SheetDrawer from './SheetDrawer';
import { isSheetSaved,saveSheet } from '../Sheets/SheetManager.js'; // <-- added
import COLORS from '../constants/colors.js';

function Navbar() {
    const location = useLocation();
    const pathname = location.pathname || '/';
    const { isLoggedIn, logout, authUsername } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        try {
            if (!isSheetSaved()) {
                const ok = window.confirm('You have unsaved changes. Leave without saving?');
                if (!ok) return;
                saveSheet(); // Save before navigating away
            }
        } catch (err) {
            // if isSheetSaved isn't ready, fall back to navigating
        }
        navigate(path);
    };

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <AppBar position="static" color="inherit" style={{backgroundColor: COLORS.primary}}>
            <Toolbar className='!flex !items-center  !w-full'>

                {/* Button to show drawer, if the location has one */}
                {pathname.split("/")[1] === "sheets" &&
                    <SheetDrawer />
                }

                {/* Logo */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    className='!text-2xl !font-medium !text-2xl'
                    style={{color: COLORS.secondary}}
                >
                    <div className="text-3xl mr-2">
                        DnD Yonder
                    </div>
                </Typography>

                {/* Left buttons */}
                <Box className='!flex !ml-4 !gap-2'>
                    <Button
                        onClick={() => handleNavigate('/')}
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: pathname === '/' ? COLORS.accent : COLORS.secondary,
                            '&:hover': {
                                color: COLORS.accentHover,
                            },
                        }}
                    >
                        Home
                    </Button>

                    {isLoggedIn &&
                        <Button
                            onClick={() => handleNavigate(`/Sheets/${authUsername}`)}
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                textTransform: 'none',
                            color: pathname === `/Sheets/${authUsername}` ? COLORS.accent : COLORS.secondary,
                            '&:hover': {
                                color: COLORS.accentHover,
                            },
                            }}
                        >
                            Sheets
                        </Button>
                    }

                </Box>

                {/* Login Button */}
                {!isLoggedIn &&
                <Box className='!flex !ml-auto'>
                    <Button
                        component={RouterLink}
                        to="/Login"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: pathname === '/Login' ? COLORS.accent : COLORS.secondary,
                            '&:hover': {
                                color: COLORS.accentHover,
                            },
                        }}
                        >
                        Login
                    </Button>
                </Box>
                    }
                {/* Logout button */}
                {isLoggedIn &&
                <Box className='!flex !ml-auto'>
                    <Button
                        component={RouterLink}
                        onClick={() => {handleLogout()}}
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: COLORS.secondary,
                            '&:hover': {
                                color: COLORS.accentHover,
                            },
                        }}
                        >
                        Logout
                    </Button>
                </Box>
                    }
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;