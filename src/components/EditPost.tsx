import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const EditPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState(location.state?.title || "");
    const [content, setContent] = useState(location.state?.content || "");

    useEffect(() => {
        // Fetch post details only if title or content is missing from the state
        if (!title || !content) {
            const fetchPost = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setTitle(data.title);
                        setContent(data.content);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            };

            fetchPost();
        }
    }, [id, title, content]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                navigate(`/post/${id}`); // Redirect to post details after update
            } else {
                alert("Failed to update the post.");
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div className="edit-post-container">
            <h2>Edit Post</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <div className="button-container">
                    <button type="submit" className="primary">Update</button>
                    <button type="button" className="secondary" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
