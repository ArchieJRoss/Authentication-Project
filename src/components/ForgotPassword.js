import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            alert('Password reset email sent');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Error sending password reset email');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ForgotPassword;
