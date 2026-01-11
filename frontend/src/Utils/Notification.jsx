import React from 'react';
import { Snackbar, Alert, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * A notification toast component.
 * 
 * @param {boolean} open - Whether the notification is visible.
 * @param {function} onClose - function to call when closing (either by timeout or click).
 * @param {string} message - The text to display.
 * @param {'error'|'success'|'info'|'warning'|'debug'} type - The severity of the notification.
 * @param {number} [duration=2000] - Duration in ms before auto-hiding.
 */
export default function Notification({ 
    open, 
    onClose, 
    message, 
    type = 'info', 
    duration = 2000 
}) {

    // Map custom 'debug' type to a valid MUI Alert severity or handle via custom boolean
    const isDebug = type === 'debug';
    // MUI Alert supports: 'error', 'warning', 'info', 'success'
    const severity = isDebug ? 'info' : type;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            TransitionComponent={Fade}
            transitionDuration={{ enter: 300, exit: 1000 }} // Slower fade out as requested
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            className="mb-4" // Tailwind margin from bottom
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                elevation={6}
                sx={{
                    width: '100%',
                    alignItems: 'center',
                    // Custom styling for 'debug' type if needed
                    ...(isDebug && {
                        backgroundColor: '#4b5563', // Tailwind gray-600
                        color: '#fff',
                        '& .MuiAlert-icon': {
                            color: '#e5e7eb' // Tailwind gray-200
                        }
                    })
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
