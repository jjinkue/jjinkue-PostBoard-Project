import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("username"); // Retrieve the logged-in username

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, content, username }),
            });

            if (response.ok) {
                navigate("/posts"); // Redirect to the post list after successful creation
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />
                <div className="button-container">
                    <button className="secondary" onClick={handleLogout}>Logout</button>
                    <button className="primary" onClick={() => navigate("/create-post")}>Create a New Post</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
