import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navbar() {
    // Hooks must be called at the top level of the component
    const location = useLocation();
    const pathname = location.pathname || '/';

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const navItems = [
        { label: 'Home', to: '/' },
        { label: 'Sheets', to: '/Sheets' },
        { label: 'Login', to: '/Login' },
    ];

    return (
        <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, mr: 2 }}
                >
                    DnD Yonder
                </Typography>

                {/* Desktop nav */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.to}
                            component={RouterLink}
                            to={item.to}
                            sx={{
                                mx: 1,
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                textTransform: 'none',
                                color: pathname === item.to ? 'primary.main' : 'text.primary',
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* Mobile menu */}
                <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
                        {navItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                onClick={handleMenuClose}
                                selected={pathname === item.to}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;