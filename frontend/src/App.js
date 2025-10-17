import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import Layout from './components/Layout';

export default function App() {
  // removed unused state vars to satisfy ESLint
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  function onLogin() {
    setIsAuthenticated(true);
  }

  // onLogout not used in current layout - keep available if needed later
  function onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
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
