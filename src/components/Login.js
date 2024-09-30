import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from './logo.svg';

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

    return (
        <div className="login-container">
            <div className="logo-section">
                <img src={logo} alt='logo'/>
                <p>Proudly American Made</p>
            </div>
            <div className="form-section">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address*</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password*</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="links">
                    <p>Need to create an account? <a href="/register">Click here to sign up.</a></p>
                    <p>Forgot your password? <a href="/forgot-password">Click here to reset it.</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
