let BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// If the app is running in the browser and the env URL points at the docker
// service hostname (e.g. http://backend:5000), replace it with localhost so
// the browser (host) can reach the backend via the published port.
if (typeof window !== 'undefined' && BASE_URL.includes('backend')) {
  try {
    const url = new URL(BASE_URL);
    url.hostname = 'localhost';
    BASE_URL = url.toString();
  } catch (e) {
    // ignore and keep the original BASE_URL
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  // 204 No Content
  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: "POST", body: JSON.stringify(body) }),
  put: (p, body) => request(p, { method: "PUT", body: JSON.stringify(body) }),
  del: (p) => request(p, { method: "DELETE" }),
};
