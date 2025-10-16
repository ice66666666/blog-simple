import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { commentsService } from "../services/commentsService";

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await commentsService.getByPost(postId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await commentsService.create(postId, newComment);
      setNewComment("");
      fetchComments(); // Refrescar comentarios
    } catch (err) {
      console.error("Error creating comment:", err);
      setError("Error al crear el comentario: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este comentario?")) {
      return;
    }

    try {
      await commentsService.remove(commentId);
      fetchComments(); // Refrescar comentarios
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Error al borrar el comentario: " + err.message);
    }
  };

  return (
    <div className="comment-section" style={{ marginTop: "16px" }}>
      <h4 style={{ marginBottom: "12px", color: "var(--gray-700)" }}>
        Comentarios ({comments.length})
      </h4>

      {/* Formulario para nuevo comentario */}
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: "16px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid var(--gray-200)",
              borderRadius: "8px",
              marginBottom: "8px",
              resize: "vertical"
            }}
          />
          <div className="actions">
            <button
              type="submit"
              className="btn primary"
              disabled={loading || !newComment.trim()}
            >
              {loading ? "Comentando..." : "Comentar"}
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <p className="muted" style={{ marginBottom: "16px" }}>
          <a href="/login" style={{ color: "var(--primary)" }}>Inicia sesión</a> para comentar
        </p>
      )}

      {error && <p className="error" style={{ marginBottom: "12px" }}>{error}</p>}

      {/* Lista de comentarios */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="muted">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="comment-item"
              style={{
                padding: "12px",
                border: "1px solid var(--gray-200)",
                borderRadius: "8px",
                marginBottom: "8px",
                backgroundColor: "var(--gray-100)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--gray-700)", marginBottom: "4px" }}>
                    @{comment.author_username}
                  </div>
                  <div style={{ color: "var(--gray-900)", marginBottom: "4px" }}>
                    {comment.content}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
                {user && user.id === comment.author_id && (
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{ marginLeft: "8px", padding: "4px 8px", fontSize: "12px" }}
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
