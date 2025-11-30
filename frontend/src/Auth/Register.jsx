import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';


export default function Register() {

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);




    const navigate = useNavigate();

    function validateForm() {
        if (!username) {
            setError('Please fill in the required fields.');
            return false;
        }

        setError('');
        return true;
    }

    async function registerUser(e) {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,
            });

            if(response.ok) {
                setLoading(false);
                navigate('/login');
                alert('Registration successful! Please log in.');
                return;
            } else {
                const data = await response.json();
                setError(data.detail || 'Registration failed. Please try again.');
                setLoading(false);
                return;
            }

        } catch (error) {
            console.error("Error during registration:", error);
            setError('An error occurred during registration. Please try again.');
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
                        width: '90vw',
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
                        Register
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
                    <div className="w-full flex justify-center">
                        <Button
                            loading={loading}
                            onClick={registerUser}
                            variant="contained"
                            className="!bg-blue-500 !text-white !px-6 !py-2 !text-lg !font-semibold !rounded-md hover:!bg-blue-700"
                            sx={{
                                fontSize: { xs: '4vw', sm: '1.125rem' },
                                width: '60vw',
                                maxWidth: 250,
                                minWidth: 120
                            }}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}