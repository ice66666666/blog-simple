import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsService } from "../services/postsService";
import { useAuth } from "../contexts/AuthContext";

export default function CreatePost() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <p className="error">Necesitas iniciar sesión para crear publicaciones.</p>;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await postsService.create(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Crear publicación</h2>
      <label>Título</label>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <label>Contenido</label>
      <textarea
        rows={6}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      />
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Publicar</button>
      </div>
    </form>
  );
}
