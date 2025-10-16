import { api } from "./api";

export const postsService = {
  list: () => api.get("/api/posts"),
  create: ({ title, content }) => api.post("/api/posts", { title, content }),
  update: (id, { title, content }) => api.put(`/api/posts/${id}`, { title, content }),
  remove: (id) => api.del(`/api/posts/${id}`),
};
