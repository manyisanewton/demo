import React from "react";
import "./ResetPasswordPage.css";
import darklogo from "../assets/dark-logo.png";

function ResetPassword() {
    const redirectToCode = () => {
        window.location.href = '/code';
    } 

    return (
        <div className="reset-passwword-container">
            <div className="logo-section">
                <img className="logo" src={darklogo} alt="The dark Moringa School daily.dev logo" />
            </div>
            <div className="reset-password-form">
                <h2>Reset your Password</h2>
                <p>Enter the email associated with your account to change your password.</p>
                <input type="email" placeholder="Enter your email" className="email-input" />
                <button className="reset-password-button" onClick={redirectToCode}>Next</button>
            </div>
        </div>
    );
};

export default ResetPassword;