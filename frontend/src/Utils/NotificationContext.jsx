import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from './Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

    const showNotification = useCallback((msg, severity = 'info') => {
        setMessage(msg);
        setType(severity);
        setOpen(true);
    }, []);

    const closeNotification = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Notification
                open={open}
                onClose={closeNotification}
                message={message}
                type={type}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
