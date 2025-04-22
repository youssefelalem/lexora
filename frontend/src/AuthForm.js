import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'; // We'll create this CSS file next

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setMessage('');
        setError('');
        setFormData({ name: '', email: '', password: '' }); // Clear form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const url = isLogin ? '/api/users/login' : '/api/users/register';
        const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

        try {
            // Use the full URL if your frontend runs on a different port than the backend during development
            const fullUrl = `http://localhost:8080${url}`; // Assuming backend runs on 8080
            const response = await axios.post(fullUrl, payload);

            if (isLogin) {
                setMessage(`Login successful! Welcome ${response.data.name}.`);
                // Handle successful login (e.g., store token/user info, redirect)
                console.log('Login response:', response.data);
            } else {
                setMessage('Registration successful! Please log in.');
                console.log('Register response:', response.data);
                switchMode(); // Switch to login form after successful registration
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'An error occurred.';
            setError(`Operation failed: ${errorMessage}`);
            console.error('Auth error:', err.response || err);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
            <button onClick={switchMode} className="switch-btn">
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
        </div>
    );
}

export default AuthForm;
