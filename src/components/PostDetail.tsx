import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    view_count: number;
    formatted_date: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PostDetail: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [viewCount, setViewCount] = useState<number>(0);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentUser = localStorage.getItem("username");  // Retrieve the logged-in user
    const hasUpdatedView = useRef(false); // Prevent duplicate view count increase

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPost(data);
                    setViewCount(data.viewCount);
                } else {
                    navigate("/notfound", { replace: true });
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                navigate("/notfound", { replace: true });
            }
        };

        fetchPost();

        // Increase view count only once
        if (!hasUpdatedView.current) {
            hasUpdatedView.current = true;
            fetch(`${API_BASE_URL}/api/posts/${id}/view`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.viewCount !== undefined) {
                        setViewCount(data.viewCount);
                    }
                })
                .catch(error => console.error("Error updating view count:", error));
        }

    }, [id, navigate]);




    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                navigate("/posts"); // Redirect to the post list after deletion
            } else {
                alert("Failed to delete the post!");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };


    if (!post) return <div>Loading...</div>;

    return (
        <div className="table-wrapper">
            <h2>Post Details</h2>
            <table className="post-table">
                <tbody>
                    <tr>
                        <th>Title</th>
                        <td>{post.title}</td>
                    </tr>
                    <tr>
                        <th>Author</th>
                        <td>{post.author}</td>
                    </tr>
                    <tr>
                        <th>Views</th>
                        <td>{post.view_count}</td>
                    </tr>
                    <tr>
                        <th>Content</th>
                        <td>{post.content}</td>
                    </tr>
                    <tr>
                        <th>Created At</th>
                        <td>{post.formatted_date}</td>
                    </tr>
                </tbody>
            </table>

            <div className="button-container">
                <button className="secondary" onClick={() => navigate("/posts")}>Back to List</button>

                {currentUser === post.author && (
                    <>
                        <button onClick={() => navigate(`/edit/${id}`, { state: { title: post.title, content: post.content } })}>
                            Edit
                        </button>
                        <button className="secondary" onClick={handleDelete}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostDetail;
