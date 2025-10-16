import { api } from "./api";

export async function register({ username, email, password }) {
  return api.post("/api/auth/register", { username, email, password });
}

export async function login({ email, password }) {
  const data = await api.post("/api/auth/login", { email, password });
  // guarda token
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
