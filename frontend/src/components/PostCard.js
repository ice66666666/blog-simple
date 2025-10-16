import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsService } from "../services/postsService";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: post.title, content: post.content });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const isAuthor = user && user.id === post.author_id;

  const handleAuthError = () => {
    logout();
    navigate("/login");
    window.alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
  };

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedPost = await postsService.update(post.id, editForm);
      setIsEditing(false);
      onPostUpdated && onPostUpdated(updatedPost);
    } catch (err) {
      console.error("Error updating post:", err);
      if (err.message.includes("401") || err.message.includes("UNAUTHORIZED")) {
        handleAuthError();
      } else {
        setError("Error al actualizar el post: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este post?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await postsService.remove(post.id);
      onPostDeleted && onPostDeleted(post.id);
    } catch (err) {
      console.error("Error deleting post:", err);
      if (err.message.includes("401") || err.message.includes("UNAUTHORIZED")) {
        handleAuthError();
      } else {
        setError("Error al borrar el post: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ title: post.title, content: post.content });
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <article className="card">
        <input
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="card-title"
          style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}
          placeholder="Título del post"
        />
        <textarea
          value={editForm.content}
          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          rows={4}
          style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px", width: "100%" }}
          placeholder="Contenido del post"
        />
        {error && <p className="error" style={{ marginBottom: "8px" }}>{error}</p>}
        <div className="actions">
          <button 
            className="btn primary" 
            onClick={handleEdit}
            disabled={loading || !editForm.title.trim() || !editForm.content.trim()}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button 
            className="btn ghost" 
            onClick={handleCancelEdit}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="card">
      <h3 className="card-title">{post.title}</h3>
      <p className="card-content">{post.content}</p>
      <div className="card-meta">
        <span>Por: {post.author_email || `Usuario ${post.author_id}`}</span>
        <span>Creado: {new Date(post.created_at).toLocaleString()}</span>
      </div>
      {error && <p className="error" style={{ marginTop: "8px" }}>{error}</p>}
      
      {/* Botones de acción del autor */}
      {isAuthor && (
        <div className="actions" style={{ marginTop: "12px" }}>
          <button 
            className="btn primary" 
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Editar
          </button>
          <button 
            className="btn danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Borrando..." : "Borrar"}
          </button>
        </div>
      )}

      {/* Botón para mostrar/ocultar comentarios */}
      <div className="actions" style={{ marginTop: "12px" }}>
        <button 
          className="btn ghost" 
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Ocultar comentarios" : "Ver comentarios"}
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && <CommentSection postId={post.id} />}
    </article>
  );
}
