import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postsService } from "../services/postsService";
import { useAuth } from "../contexts/AuthContext";

export default function CreatePost() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <p className="error">Redirigiendo al login...</p>;
  }

  const validateForm = () => {
    const errors = {};
    
    // Solo validar que no estén vacíos
    if (!form.title.trim()) {
      errors.title = "El título es requerido";
    }

    if (!form.content.trim()) {
      errors.content = "El contenido es requerido";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Enviando datos:", form);
      await postsService.create(form);
      navigate("/");
    } catch (err) {
      console.error("Error completo:", err);
      console.error("Mensaje de error:", err.message);
      
      // Manejo simplificado de errores
      if (err.message.includes("El título es requerido")) {
        setError("El título es requerido");
        setFieldErrors({ title: "El título es requerido" });
      } else if (err.message.includes("El contenido es requerido")) {
        setError("El contenido es requerido");
        setFieldErrors({ content: "El contenido es requerido" });
      } else if (err.message.includes("401")) {
        setError("Sesión expirada. Por favor inicia sesión nuevamente.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.message.includes("403")) {
        setError("No tienes permisos para crear posts.");
      } else {
        // Mostrar el mensaje exacto del servidor
        setError(err.message || "Error al crear el post. Intenta nuevamente.");
      }
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Crear publicación</h2>
      
      <label>Título</label>
      <input
        value={form.title}
        onChange={(e) => {
          setForm({ ...form, title: e.target.value });
          if (fieldErrors.title) {
            setFieldErrors({ ...fieldErrors, title: null });
          }
        }}
        className={fieldErrors.title ? "error" : ""}
        placeholder="Título de tu publicación"
      />
      {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
      
      <label>Contenido</label>
      <textarea
        rows={6}
        value={form.content}
        onChange={(e) => {
          setForm({ ...form, content: e.target.value });
          if (fieldErrors.content) {
            setFieldErrors({ ...fieldErrors, content: null });
          }
        }}
        className={fieldErrors.content ? "error" : ""}
        placeholder="Escribe el contenido de tu publicación..."
      />
      {fieldErrors.content && <p className="field-error">{fieldErrors.content}</p>}
      
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Publicar</button>
      </div>
    </form>
  );
}
