export default function PostCard({ post }) {
  return (
    <article className="card">
      <h3 className="card-title">{post.title}</h3>
      <p className="card-content">{post.content}</p>
      <div className="card-meta">
        <span>Por: {post.author_email || `Usuario ${post.author_id}`}</span>
        <span>Creado: {new Date(post.created_at).toLocaleString()}</span>
      </div>
    </article>
  );
}
