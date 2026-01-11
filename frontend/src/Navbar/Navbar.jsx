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
import { useNotification } from '../Utils/NotificationContext.jsx';

function Navbar() {
    const location = useLocation();
    const pathname = location.pathname || '/';
    const { isLoggedIn, logout, authUsername, isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleNavigate = async (path) => {
        try {
            // Check if we are on a sheet page by path
            // (Optional check: if pathname starts with /Sheets/)
            if (!isSheetSaved()) {
                const wantToSave = window.confirm('You have unsaved changes. Click OK to save and leave, or Cancel to discard changes and leave.');
                
                if (wantToSave) {
                    const success = await saveSheet(true); // silent=true so we use custom notification
                    if (success) {
                        showNotification("Save successful!", "success");
                    } else if (success === false) {
                        showNotification("Save failed!", "error");
                        // Decide if we should block navigation on failure?
                        // For now, let's allow since the user wanted to leave.
                    }
                } else {
                     // User cancelled (discard changes)
                     // Do nothing, just proceed to navigate
                }
            }
        } catch (err) {
            console.error("Error during navigation save check:", err);
            showNotification("Save check failed!", "error");
        }
        navigate(path);
    };

    function handleLogout() {
        logout();
        navigate('/');
    }

    const atSheetsPage = pathname.split("/")[1] === "sheets";
    const atAdminPage = pathname.split("/")[1] === "admin";
    const atHomePage = pathname === "/";
    const atLoginPage = pathname === "/login";

    return (
        <>
        <AppBar position="relative" color="primary" elevation={1} sx={{ width: '100%', left: 0, marginBottom: '16px' }}>
            <Container
                maxWidth={false} // <-- disables default maxWidth
                sx={{
                    width: '100%', // <-- stretches container to viewport width
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '2vw', sm: '16px' }, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {atSheetsPage && <SheetDrawer />}
                        <Typography
                            component={RouterLink}
                            to="/"
                            sx={{
                                fontWeight: 500,
                                fontSize: { xs: '28px', sm: '2.5rem' },
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
                                fontSize: { xs: '16px', sm: '1.125rem' },
                                textTransform: 'none',
                                color: atHomePage ? 'textHighlights.main' : 'textMain.main',
                                '&:hover': { color: 'textHover.main' },
                                minWidth: { xs: '64px', sm: 'auto' },
                            }}
                        >
                            Home
                        </Button>
                        {isLoggedIn &&
                            <Button
                                onClick={() => handleNavigate(`/Sheets/${authUsername}`)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '16px', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atSheetsPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '64px', sm: 'auto' },
                                }}
                            >
                                Sheets
                            </Button>
                        }
                        {isLoggedIn && isAdmin &&
                            <Button
                                onClick={() => handleNavigate(`/admin`)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '16px', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atAdminPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '64px', sm: 'auto' },
                                }}
                            >
                                Admin
                            </Button>
                        }
                    </Box>
                    {/* Right side: Login/Logout */}
                    <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', gap: { xs: '2vw', sm: '16px' } }}>
                        {!isLoggedIn &&
                            <Button
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '16px', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '64px', sm: 'auto' },
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
                                    fontSize: { xs: '16px', sm: '1.125rem' },
                                    textTransform: 'none',
                                    color: atLoginPage ? 'textHighlights.main' : 'textMain.main',
                                    '&:hover': { color: 'textHover.main' },
                                    minWidth: { xs: '64px', sm: 'auto' },
                                }}
                            >
                                Logout
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
        
        </>
    );
}

export default Navbar;