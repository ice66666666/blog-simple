import React, { useState } from 'react';
import './App.css';
import PostList from './components/PostList';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';

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
    <div className="App">
      <header className="App-header">
        <h1>Blog Simple</h1>
        <nav>
          <button onClick={() => setView('posts')}>Ver Posts</button>
          {!isAuthenticated ? (
            <>
              <button onClick={() => setView('login')}>Iniciar sesión</button>
              <button onClick={() => setView('register')}>Registrarse</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('create')}>Crear Post</button>
              <button onClick={onLogout}>Cerrar sesión</button>
            </>
          )}
        </nav>
      </header>

      <main>
        {view === 'posts' && <PostList />}
        {view === 'login' && <Login onLogin={onLogin} />}
        {view === 'register' && <Register onRegister={onLogin} />}
        {view === 'create' && <CreatePost />}
      </main>
    </div>
  );
}
