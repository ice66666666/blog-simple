import { useEffect, useState } from "react";
import { postsService } from "../services/postsService";
import LoadingSpinner from "./LoadingSpinner";
import PostCard from "./PostCard";

export default function Home() {
  const [state, setState] = useState({ loading: true, posts: [], error: null });
  const [commentsVisibility, setCommentsVisibility] = useState({});

  const fetchPosts = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await postsService.list();
      setState({ loading: false, posts: data.posts || [], error: null });
    } catch (err) {
      setState({ loading: false, posts: [], error: err.message });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostUpdated = (updatedPost) => {
    // Solo actualizar el post específico en lugar de refrescar toda la lista
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    }));
  };

  const handlePostDeleted = (deletedPostId) => {
    // Solo remover el post específico de la lista
    setState(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== deletedPostId)
    }));
    // También limpiar el estado de comentarios del post eliminado
    setCommentsVisibility(prev => {
      const newState = { ...prev };
      delete newState[deletedPostId];
      return newState;
    });
  };

  const toggleComments = (postId) => {
    setCommentsVisibility(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (state.loading) {
    return (
      <div className="center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.error) {
    return <p className="error">Error: {state.error}</p>;
  }

  if (!state.posts.length) {
    return <p className="muted">Aún no hay publicaciones.</p>;
  }

  return (
    <div className="grid">
      {state.posts.map((p) => (
        <PostCard 
          key={p.id} 
          post={p} 
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
          showComments={commentsVisibility[p.id] || false}
          onToggleComments={() => toggleComments(p.id)}
        />
      ))}
    </div>
  );
}
