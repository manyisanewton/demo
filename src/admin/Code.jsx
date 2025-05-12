import React from "react";
import "./Code.css";
import logo from "../assets/logo.png";

function Code() {
    const redirectToNewPassword = () => {
        window.location.href = '/new-password';
    }

    const redirectToInsertEmail = () => {
        window.location.href = '/reset-password';
    }

    return (
        <div className="new-code-container">
            <div className="logo-section">
                <img className="light-logo" src={logo} alt="Moringa School daily.dev logo"  />
            </div>
            <div className="code-form">
                <h2>We sent you a code</h2>
                <p>Check your email to get your confirmation code. If you need to request a new code, go back and re-enter your email</p>
                <input type="number" placeholder="Enter your code" className="code-input" />
                <div className="code-buttons">
                    <button className="back-button" onClick={redirectToInsertEmail}>Back</button>
                    <button className="next-button" onClick={redirectToNewPassword}>Next</button>
                </div>
            </div>
        </div>

    );
};

export default Code;