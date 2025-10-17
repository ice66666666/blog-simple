import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import Layout from './components/Layout';

export default function App() {
  const [view, setView] = useState('posts');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  function onLogin() {
    setIsAuthenticated(true);
    setView('posts');
  }

  function onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setView('posts');
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );

}
