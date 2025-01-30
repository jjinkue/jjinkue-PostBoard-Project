import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <h2>Page Not Found 😢</h2>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => navigate("/login")}>Go to Home</button>
        </div>
    );
};

export default NotFound;
