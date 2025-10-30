import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postsService } from "../services/postsService";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onPostUpdated, onPostDeleted, showComments, onToggleComments }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: post.title, content: post.content });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthor = user && user.id === post.author_id;

  // Debug temporal: Log cuando cambia el estado
  console.log(`PostCard ${post.id}: showComments = ${showComments}`);

  const handleToggleComments = () => {
    console.log(`Toggling comments for post ${post.id}: ${showComments} -> ${!showComments}`);
    onToggleComments();
  };

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

  const escapeHtml = (s) =>
    s
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;")
      .replaceAll(/\"/g, "&quot;")
      .replaceAll(/'/g, "&#39;");

  const toHtml = (text) => {
    if (!text) return { __html: "" };
    
    let html = String(text);
    const replacements = [];
    let replacementIndex = 0;
    
    // Paso 1: Convertir imágenes de markdown a HTML
    // Patrón: ![alt text](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      const escapedAlt = escapeHtml(alt || "imagen");
      const cleanUrl = url.trim();
      // NO escapar la URL aquí, solo limpiarla
      const imgTag = `<img src="${cleanUrl}" alt="${escapedAlt}" loading="lazy" decoding="async" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0; display:block;" />`;
      const placeholder = `__IMGPLACEHOLDER${replacementIndex}__`;
      replacements.push({ placeholder, replacement: imgTag });
      replacementIndex++;
      return placeholder;
    });
    
    // Paso 2: Convertir enlaces de markdown a HTML (solo los que no son imágenes)
    html = html.replace(/([^!]|^)\[([^\]]+)\]\(([^)]+)\)/g, (match, before, txt, url) => {
      const escapedText = escapeHtml(txt);
      const cleanUrl = url.trim();
      const linkTag = `<a href="${cleanUrl}" target="_blank" rel="noreferrer">${escapedText}</a>`;
      const placeholder = `__LINKPLACEHOLDER${replacementIndex}__`;
      replacements.push({ placeholder, replacement: linkTag });
      replacementIndex++;
      return (before || '') + placeholder;
    });
    
    // Paso 3: Escapar HTML restante
    // Los placeholders tienen guiones bajos que NO se escapan, así que están seguros
    html = escapeHtml(html);
    
    // Paso 4: Restaurar los placeholders con HTML real
    // Usar split/join que es más seguro y funciona siempre
    replacements.forEach(({ placeholder, replacement }) => {
      html = html.split(placeholder).join(replacement);
    });
    
    // Paso 5: Convertir saltos de línea a <br/>
    html = html.replace(/\n/g, "<br/>");
    
    return { __html: html };
  };

  return (
    <article className="card">
      {isEditing ? (
        <>
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
        </>
      ) : (
        <>
          <h3 className="card-title">{post.title}</h3>
          <div className="card-content" dangerouslySetInnerHTML={toHtml(post.content)} />
          <div className="card-meta">
            <span>Por: {post.author_username || post.author_email || `Usuario ${post.author_id}`}</span>
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
              onClick={handleToggleComments}
            >
              {showComments ? "Ocultar comentarios" : "Ver comentarios"}
            </button>
          </div>

          {/* Sección de comentarios */}
          {showComments && <CommentSection postId={post.id} />}
        </>
      )}
    </article>
  );
}
