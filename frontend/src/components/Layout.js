import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-left">
          <Link className="brand" to="/">BlogSimple</Link>
          <NavLink className="nav-link" to="/">Inicio</NavLink>
          {isAuthenticated && (
            <NavLink className="nav-link" to="/create">Crear</NavLink>
          )}
        </div>
        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <NavLink className="btn ghost" to="/login">Iniciar sesión</NavLink>
              <NavLink className="btn primary" to="/register">Registrarse</NavLink>
            </>
          ) : (
            <>
              <span className="user-tag">@{user?.username}</span>
              <button className="btn danger" onClick={handleLogout}>Salir</button>
            </>
          )}
        </div>
      </nav>
      <main className="container">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} BlogSimple</footer>
    </div>
  );
}
