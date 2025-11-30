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
import { isSheetSaved, saveSheet } from '../Sheets/SheetManager.js';

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
                saveSheet();
            }
        } catch (err) {}
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
        <AppBar position="relative" color="primary" elevation={1} sx={{ width: '100vw', left: 0 }}>
            <Container
                maxWidth={false} // <-- disables default maxWidth
                sx={{
                    width: '100vw', // <-- stretches container to viewport width
                    minWidth: 0,
                    paddingLeft: { xs: '2vw', sm: '15px' },
                    paddingRight: { xs: '2vw', sm: '25px' },
                    marginLeft: 0,
                    marginRight: 0,
                    boxSizing: 'border-box',
                }}
                disableGutters
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: 0,
                        flexWrap: 'nowrap',
                        gap: { xs: '2vw', sm: '16px' },
                        paddingLeft: 0,
                        paddingRight: 0,
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Left side: Logo and navigation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '2vw', sm: '16px' } }}>
                        {atSheetsPage && <SheetDrawer />}
                        <Typography
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontWeight: 500,
                                fontSize: { xs: '7vw', sm: '2.5rem' },
                                textDecoration: 'none',
                                color: 'textMain.main',
                                '&:hover': { color: 'textHover.main' },
                                minWidth: 0,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            DnD Yonder
                        </Typography>
                        <Button
                            onClick={() => handleNavigate('/')}
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '4vw', sm: '1.125rem' },
                                textTransform: 'none',
                                color: atHomePage ? 'textHighlights.main' : 'textMain.main',
                                '&:hover': { color: 'textHover.main' },
                                minWidth: { xs: '18vw', sm: 'auto' },
                            }}
                        >
                            Home
                        </Button>
                        {isLoggedIn &&
                            <Button
                                onClick={() => handleNavigate(`/Sheets/${authUsername}`)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '4vw', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atSheetsPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '18vw', sm: 'auto' },
                                }}
                            >
                                Sheets
                            </Button>
                        }
                    </Box>
                    {/* Right side: Login/Logout */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isLoggedIn &&
                            <Button
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '4vw', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '18vw', sm: 'auto' },
                                }}
                            >
                                Login
                            </Button>
                        }
                        {isLoggedIn &&
                            <Button
                                onClick={handleLogout}
                                type="button"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '4vw', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '18vw', sm: 'auto' },
                                }}
                            >
                                Logout
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }} />
        </>
    );
}

export default Navbar;