import { useEffect, useState } from "react";
import { postsService } from "../services/postsService";
import LoadingSpinner from "./LoadingSpinner";
import PostCard from "./PostCard";

export default function Home() {
  const [state, setState] = useState({ loading: true, posts: [], error: null });

  useEffect(() => {
    let mounted = true;
    postsService
      .list()
      .then((data) => {
        if (!mounted) return;
        setState({ loading: false, posts: data.posts || [], error: null });
      })
      .catch((err) => setState({ loading: false, posts: [], error: err.message }));
    return () => (mounted = false);
  }, []);

  if (state.loading) {
    return (
      <div className="center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.error) {
    return <p className="error">Error: {state.error}</p>;
  }

  if (!state.posts.length) {
    return <p className="muted">Aún no hay publicaciones.</p>;
  }

  return (
    <div className="grid">
      {state.posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
