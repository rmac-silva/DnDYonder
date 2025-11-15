import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth/AuthContext';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import SheetDrawer from './SheetDrawer';
import { isSheetSaved,saveSheet } from '../Sheets/SheetManager.js'; // <-- added

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

    const atSheetsPage = pathname.split("/")[1] === "sheets";
    const atHomePage = pathname === "/";
    const atLoginPage = pathname === "/login";

    return (
        <>
        <AppBar position="fixed"  color="primary" elevation={1}>
            <Container maxWidth="full" disableGutters>

            <Toolbar className='!flex !items-center  !w-full'>

                {/* Button to show drawer, if the location has one */}
                {atSheetsPage &&
                    <SheetDrawer />
                }

                {/* Logo */}
                <Typography
                    
                    component={RouterLink}
                    to="/"
                    className=' !font-medium !text-4xl'
                    
                    sx={{ 
                            color: 'textMain.main',
                            '&:hover': { color: 'textHover.main'}
                     }}
                    
                >
                    DnD Yonder
                </Typography>

                {/* Left buttons */}
                <Box className='!flex !ml-4 !gap-2'>
                    <Button
                        onClick={() => handleNavigate('/')} /* intercept navigation to warn about unsaved changes */
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: atHomePage ?  'textHighlights.main' : 'textMain.main',
                            '&:hover': { color: 'textHover.main' },
                        }}
                    >
                        Home
                    </Button>

                    {isLoggedIn &&
                        <Button
                            onClick={() => handleNavigate(`/Sheets/${authUsername}`)} /* intercept navigation to warn about unsaved changes */
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                textTransform: 'none',
                                color: atSheetsPage ? 'textHighlights.main' : 'textMain.main',
                                '&:hover': { color: 'textHover.main' },
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
                        to="/login"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                            '&:hover': { color: 'textHover.main' },
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
                        onClick={handleLogout}
                        type="button"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                            '&:hover': { color: 'textHover.main' },
                        }}
                        >
                        Logout
                    </Button>
                </Box>
                    }
            </Toolbar>
            </Container>

        </AppBar>
        <Toolbar />
        </>
    );
}

export default Navbar;