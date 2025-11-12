import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import COLORS from '../constants/colors.js';


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
            const response = await fetch('http://127.0.0.1:8000/auth/register', {
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

            {/* Full-width container that centers the card horizontally */}
            <div className="w-full flex justify-center mt-8 px-4">
                {/* Centered form card with a fixed width so the whole card is centered on the page */}
                <div
                    className="bg-zinc-200 rounded-md p-8 flex flex-col items-start"
                    style={{ width: 900, backgroundColor: COLORS.primary }} // fixed card width keeps it centered reliably
                >
                    {/* Header (centered within the card) */}
                    <div className="text-4xl font-bold mb-6 self-center" style={{color: COLORS.secondary}}>Register</div>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    {/* Email Field (starts at same X as password input) */}
                    <div style={{ width: 800 }} className="mb-4">
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

                    {/* Login Button - centered */}
                    <div className="w-full flex justify-center">
                        <Button
                        loading={loading}
                        onClick={registerUser}
                            variant="contained"
                            className="!px-6 !py-2 !text-lg !font-semibold !rounded-md"
                            style={{backgroundColor: COLORS.accent, color: COLORS.primary}}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.accentHover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.accent}

                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}