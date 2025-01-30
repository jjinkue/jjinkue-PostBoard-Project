import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from "./components/Register";
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import NotFound from "./components/NotFound";
import './styles.css';

const App: React.FC = () => {
    const isAuthenticated = useMemo(() => !!localStorage.getItem("token"), []);

    return (
        <Router>
            <div className="container">
                <h1>PostBoard</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/edit/:id" element={<EditPost />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
