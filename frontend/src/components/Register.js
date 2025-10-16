import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "El correo es requerido";
    }
    if (!emailRegex.test(email)) {
      return "Por favor ingresa un correo válido";
    }
    return null;
  };

  const validateUsername = (username) => {
    if (!username) {
      return "El nombre de usuario es requerido";
    }
    if (username.length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Solo se permiten letras, números y guiones bajos";
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    const emailError = validateEmail(form.email);
    if (emailError) {
      errors.email = emailError;
    }

    const usernameError = validateUsername(form.username);
    if (usernameError) {
      errors.username = usernameError;
    }

    if (!form.password) {
      errors.password = "La contraseña es requerida";
    } else if (form.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
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
      await register(form);
      setOk(true);
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      // Manejar diferentes tipos de errores específicos
      if (err.message.includes("correo electrónico ya está registrado")) {
        setError("Este correo electrónico ya está registrado");
        setFieldErrors({ email: "Este correo electrónico ya está registrado" });
      } else if (err.message.includes("nombre de usuario ya está registrado")) {
        setError("Este nombre de usuario ya está registrado");
        setFieldErrors({ username: "Este nombre de usuario ya está registrado" });
      } else {
        setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
      }
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Crear cuenta</h2>
      
      <label>Usuario</label>
      <input
        value={form.username}
        onChange={(e) => {
          setForm({ ...form, username: e.target.value });
          if (fieldErrors.username) {
            setFieldErrors({ ...fieldErrors, username: null });
          }
        }}
        className={fieldErrors.username ? "error" : ""}
        placeholder="mi_usuario123"
      />
      {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
      
      <label>Correo</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => {
          setForm({ ...form, email: e.target.value });
          if (fieldErrors.email) {
            setFieldErrors({ ...fieldErrors, email: null });
          }
        }}
        className={fieldErrors.email ? "error" : ""}
        placeholder="ejemplo@correo.com"
      />
      {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
      
      <label>Contraseña</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => {
          setForm({ ...form, password: e.target.value });
          if (fieldErrors.password) {
            setFieldErrors({ ...fieldErrors, password: null });
          }
        }}
        className={fieldErrors.password ? "error" : ""}
        placeholder="Mínimo 6 caracteres"
      />
      {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
      
      {error && <p className="error">{error}</p>}
      {ok && <p className="success">Cuenta creada. Redirigiendo…</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Registrar</button>
        <Link className="btn ghost" to="/login">Ya tengo cuenta</Link>
      </div>
    </form>
  );
}

