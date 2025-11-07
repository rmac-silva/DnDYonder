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
        <AppBar position="static" color="inherit" className='!bg-slate-300'>
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
                    className='!text-black !font-medium !text-2xl'
                >
                    <div className="text-3xl mr-2">
                        DnD Yonder
                    </div>
                </Typography>

                {/* Left buttons */}
                <Box className='!flex !ml-4 !gap-2'>
                    <Button
                        onClick={() => handleNavigate('/')} /* intercept navigation to warn about unsaved changes */
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: pathname === '/' ? 'primary.main' : 'text.primary',
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
                                color: pathname === `/Sheets/${authUsername}` ? 'primary.main' : 'text.primary',
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
                            color: pathname === '/Login' ? 'primary.main' : 'text.primary',
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
                            color: pathname === '/Login' ? 'primary.main' : 'text.primary',
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