import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Post {
    id: number;
    title: string;
    author: string;
    view_count: number;
    formatted_date: string;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("You need to log in to access posts.");
            navigate("/login");
        }
        else {
            const fetchPosts = async () => {
                try {
                    const response = await fetch("http://localhost:5001/api/posts");
                    if (response.ok) {
                        const data = await response.json();
                        setPosts(data);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            };

            fetchPosts();
        }

    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <div>
            <h2>Post List</h2>
            <table className="post-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Views</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                            <td>{post.title}</td>
                            <td>{post.author}</td>
                            <td>{post.view_count}</td>
                            <td>{post.formatted_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <button className="secondary" onClick={handleLogout}>Logout</button>
                <Link to="/create-post">
                    <button>Create a New Post</button>
                </Link>
            </div>

        </div>
    );
};

export default PostList;
