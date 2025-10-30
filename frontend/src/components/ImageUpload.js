import React, { useState } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError("");
    setUrl("");
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);

      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      setError(err.message || "Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2>Subir imagen</h2>
      <input type="file" accept="image/*" onChange={onChange} />
      <div className="actions" style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={onUpload} disabled={!file || loading}>
          {loading ? "Subiendo..." : "Subir"}
        </button>
      </div>
      {error && <p className="error" style={{ marginTop: 8 }}>{error}</p>}
      {url && (
        <div style={{ marginTop: 12 }}>
          <a href={url} target="_blank" rel="noreferrer">Ver imagen</a>
          <div style={{ marginTop: 8 }}>
            <img src={url} alt="uploaded" style={{ maxWidth: 320, borderRadius: 8 }} />
          </div>
        </div>
      )}
    </div>
  );
}
