import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/auth/register', formData);
            alert('Registration successful');
            window.location.href = '/login'; // Redirect to login page after successful registration
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="primary-button">Register</button>
            </form>
            <div className="nav-buttons">
                <button onClick={() => window.location.href = '/'} className="nav-button">Home</button>
                <button onClick={() => window.location.href = '/login'} className="nav-button">Login</button>
            </div>
        </div>
    );
};

export default Register;
