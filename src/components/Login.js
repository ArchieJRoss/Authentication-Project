import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefaul();
        try {
            const response = await axios.post('/api/auth/login', {email, password});
            localStorage.setItem('token', response.data.token);
            navigate.push('/dashboard');
            } catch (error) {
            console.error('Login failed:', error);
            }
        };

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
            <button onClick={handleRegisterClick}>Register</button>
        </form>
        );
};

export default Login;