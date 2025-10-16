import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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

  const validateForm = () => {
    const errors = {};
    
    const emailError = validateEmail(form.email);
    if (emailError) {
      errors.email = emailError;
    }

    if (!form.password) {
      errors.password = "La contraseña es requerida";
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
      await login(form);
      navigate("/");
    } catch (err) {
      // Manejar diferentes tipos de errores
      if (err.message.includes("400")) {
        setError("Credenciales inválidas. Verifica tu correo y contraseña.");
      } else if (err.message.includes("401")) {
        setError("Credenciales incorrectas. Intenta nuevamente.");
      } else {
        setError(err.message || "Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Iniciar sesión</h2>
      <label>Correo</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => {
          setForm({ ...form, email: e.target.value });
          // Limpiar error del campo cuando el usuario empiece a escribir
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
          // Limpiar error del campo cuando el usuario empiece a escribir
          if (fieldErrors.password) {
            setFieldErrors({ ...fieldErrors, password: null });
          }
        }}
        className={fieldErrors.password ? "error" : ""}
        placeholder="Tu contraseña"
      />
      {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
      
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Entrar</button>
      </div>
    </form>
  );
}
