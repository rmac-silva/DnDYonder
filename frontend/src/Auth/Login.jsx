import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import Link from '@mui/material/Link';
import { useAuth } from '../Auth/AuthContext';

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { email, setEmail, checkAuth } = useAuth();


    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !password) {
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
        formDetails.append('email', username);
        formDetails.append('password', password);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/token', {
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
                setEmail(data.email);
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
                    style={{ width: 900 }} // fixed card width keeps it centered reliably
                >
                    {/* Header (centered within the card) */}
                    <div className="text-4xl font-bold text-gray-800 mb-6 self-center">Login</div>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    {/* Email Field (starts at same X as password input) */}
                    <div style={{ width: 800 }} className="mb-4">
                        <TextField
                            className='!w-full'
                            required
                            id="filled-email-input"
                            label="Email"
                            type="email"
                            size="medium"
                            autoComplete="current-email"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="filled"
                            slotProps={{
                                inputLabel: { style: { fontSize: '1.25rem' } },
                                input: { style: { fontSize: '1.25rem' } }
                            }}
                        />
                    </div>

                    {/* Password row: wider so the total row (input + button) extends further right */}
                    <div style={{ width: 838 }} className=" flex items-center">
                        <TextField
                            required
                            className='!w-full'
                            id="filled-password-input"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            variant="filled"
                            onChange={(e) => setPassword(e.target.value)}
                            slotProps={{
                                inputLabel: { style: { fontSize: '1.25rem' } },
                                input: { style: { fontSize: '1.25rem' } }
                            }}
                            sx={{ mr: 1 }}
                        />
                        <IconButton aria-label="show password" edge="end" onClick={() => setShowPassword(!showPassword)}>
                            <Visibility />
                        </IconButton>
                    </div>

                    {/* Not yet registered? Click here */}
                    <div className="text-sm mt-1 mb-6">
                        <span className='text-gray-800 font-semibold'>Not yet registered? </span>
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Create an account
                        </Link>
                    </div>

                    {/* Login Button - centered */}
                    <div className="w-full flex justify-center">
                        <Button
                            loading={loading}
                            variant="contained"
                            className="!bg-blue-500 !text-white !px-6 !py-2 !text-lg !font-semibold !rounded-md hover:!bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}



        

    