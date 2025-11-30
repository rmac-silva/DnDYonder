import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useAuth } from '../Auth/AuthContext';

export default function Login() {

    const [username, setUsername] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuthUsername, checkAuth } = useAuth();


    const navigate = useNavigate();

    const validateForm = () => {
        if (!username) {
            setError('Please fill in the required fields.');
            return false;
        }

        setError('');
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        console.log("Window origin", window.location.origin);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,
            });

            setLoading(false);

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.access_token);
                setAuthUsername(data.username);
                await checkAuth();
                navigate('/');
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Login failed. Please try again.');
                return;
            }
        }
        catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
            setLoading(false);
            return;
        }

    }


    return (
        <>
            <Navbar />
            <div className="w-full flex justify-center mt-8 px-4">
                <div
                    className="bg-zinc-200 rounded-md p-8 flex flex-col items-start"
                    style={{
                        width: '300vw',

                        maxWidth: '80%',
                        minWidth: 0,
                        boxSizing: 'border-box'
                    }}
                >
                    <div
                        className="font-bold text-gray-800 self-center"
                        style={{
                            
                            fontSize: '3rem',
                            marginBottom: '2vw',
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        Login
                    </div>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    <div style={{ width: '100%' }} className="mb-4">
                        <TextField
                            className='!w-full'
                            required
                            id="filled-email-input"
                            label="Username"
                            type="text"
                            size="medium"
                            autoComplete="current-username"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="filled"
                            slotProps={{
                                inputLabel: { style: { fontSize: '1.25rem' } },
                                input: { style: { fontSize: '1.25rem' } }
                            }}
                        />
                    </div>
                    <div className="text-sm mt-1 mb-6" style={{ width: '100%' }}>
                        <span className='text-gray-800 font-semibold'>Not yet registered? </span>
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Create an account
                        </Link>
                    </div>
                    <div className="w-full flex justify-center">
                        <Button
                            loading={loading}
                            variant="contained"
                            className="!bg-blue-500 !text-white !px-6 !py-2 !text-lg !font-semibold !rounded-md hover:!bg-blue-700"
                            onClick={handleSubmit}
                            sx={{
                                fontSize: { xs: '4vw', sm: '1.125rem' },
                                width: '60vw',
                                maxWidth: 250,
                                minWidth: 120
                            }}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}





