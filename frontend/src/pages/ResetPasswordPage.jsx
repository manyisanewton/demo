import './ResetPasswordPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Client-side validation
        if (!token.trim()) {
            setError('Reset token is required.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token.trim(),
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password has been reset successfully.');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="reset-password-container">
            <div className="left-panel">
                <h1>Reset Your Password</h1>
                <p>
                    Already have an account? Log in to continue your tech journey with Moringa School daily.dev!
                </p>
                <button className="login-btn" onClick={handleLoginRedirect}>
                    Log In
                </button>
            </div>

            <div className="right-panel">
                <div className="form-card">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Reset Token:</label>
                        <input
                            type="text"
                            placeholder="Enter your reset token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />

                        <label>New Password:</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <button type="submit" className="reset-btn">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;