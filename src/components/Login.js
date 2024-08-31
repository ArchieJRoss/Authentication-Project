import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: Invalid credentials or server error');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <div className='logincontainer'>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Email' 
                    required 
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Password' 
                    required 
                    />
                </div>
                <button type="submit">Login</button>
                <button type="button" onClick={handleRegisterClick}>Register</button>
            </form>
        </div>
    );
};

export default Login;
