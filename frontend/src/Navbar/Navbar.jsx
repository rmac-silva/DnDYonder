import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navbar() {

    const location = useLocation();
    const pathname = location.pathname || '/';

    return (
        <AppBar position="static" color="inherit" className='!bg-slate-300'>
            <Toolbar className='!flex !items-center  !w-full'>
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
                        component={RouterLink}
                        to="/"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: pathname === '/' ? 'primary.main' : 'text.primary',
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/Sheets"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            textTransform: 'none',
                            color: pathname === '/Sheets' ? 'primary.main' : 'text.primary',
                        }}
                    >
                        Sheets
                    </Button>
                </Box>

                {/* Right button */}
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
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;