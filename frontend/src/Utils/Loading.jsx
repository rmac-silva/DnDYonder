import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * A reusable loading component that combines MUI and Tailwind.
 * @param {string} message - Optional text to display below the spinner.
 */
function Loading({ message = "Loading..." }) {
    return (
        <Box 
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center w-screen h-screen bg-white"
        >
            {/* Spinning icon using MUI CircularProgress */}
            <CircularProgress 
                size={60} 
                thickness={4} 
                className="text-blue-600 mb-4" 
            />
            
            {/* Custom message using MUI Typography and Tailwind styling */}
            <Typography 
                variant="h6" 
                className="text-gray-600 font-medium animate-pulse"
            >
                {message}
            </Typography>
        </Box>
    );
}

export default Loading;