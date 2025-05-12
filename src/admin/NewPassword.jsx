import React, { useState } from "react";
import "./NewPassword.css";
import darklogo from "../assets/dark-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function NewPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <div className="new-password-container">
            <div className="logo-section">
                <img className="logo-new" src={darklogo} alt="Moringa School daily.dev logo" />
            </div>
            <div className="new-password-form">
                <h2>Choose your new Password</h2>
                <p>Make sure your new password is 8 characters or more. Try including numbers, letters, or punctuation marks for a <span>strong password</span></p>

                <div className="password-wrapper">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter your New Password" />
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className="password-wrapper">
                    <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your New Password" />
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>
                <button className="change-password" onClick={redirectToLogin}>Change Password</button>
            </div>
        </div>

    )

}

export default NewPassword;