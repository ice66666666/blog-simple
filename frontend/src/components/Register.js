import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      setOk(true);
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Crear cuenta</h2>
      <label>Usuario</label>
      <input
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <label>Correo</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <label>Contraseña</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      {error && <p className="error">{error}</p>}
      {ok && <p className="success">Cuenta creada. Redirigiendo…</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Registrar</button>
        <Link className="btn ghost" to="/login">Ya tengo cuenta</Link>
      </div>
    </form>
  );
}

