import { useState, useEffect } from 'react';
import { postsService } from '../services/postsService';
import toast from 'react-hot-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsService.list();
      setPosts(response.posts || []);
    } catch (err) {
      setError(err.message || 'Error al cargar los posts');
      toast.error(err.message || 'Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await postsService.create(postData);
      setPosts(prev => [response.post, ...prev]);
      toast.success('Post creado exitosamente');
      return response;
    } catch (err) {
      toast.error(err.message || 'Error al crear el post');
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
  };
};
