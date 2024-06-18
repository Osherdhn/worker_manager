import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        const isLongEnough = password.length >= 8;

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
    };

    const registerUser = async () => {
        if (!username) {
            setError('Username is required.');
        } else if (!password) {
            setError('Password is required.');
        } else if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        } else {
            try {
                const response = await axios.post('http://localhost:3001/api/workerManager_db/users', { username, password });
                setSuccess('User registered successfully');
                setError('');
                setUsername('');
                setPassword('');
            } catch (error) {
                console.error('Error registering user:', error);
                if (error.response && error.response.status === 409) {
                    setError('Username already exists');
                } else {
                    setError('An error occurred. Please try again.');
                }
                setSuccess('');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <label htmlFor="username" className="form-label">Username</label>
            <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password" className="form-label">Password</label>
            <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={registerUser}>Register</button>
            <p className="login-link">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default Register;
