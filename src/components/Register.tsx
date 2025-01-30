import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation: Ensure passwords match
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        setError("");

        try {
            const response = await fetch("http://localhost:5001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert("Registration successful! Redirecting to login page.");
                navigate("/login"); // Redirect to login page after registration
            } else {
                const data = await response.json();
                setError(data.message || "회원가입 실패!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Server error. Registration failed.");
        }
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
            </button>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default Register;
