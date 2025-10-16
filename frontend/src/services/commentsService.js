import { api } from "./api";

export const commentsService = {
  getByPost: (postId) => api.get(`/api/comments/post/${postId}`),
  create: (postId, content) => api.post(`/api/comments/post/${postId}`, { content }),
  update: (commentId, content) => api.put(`/api/comments/${commentId}`, { content }),
  remove: (commentId) => api.del(`/api/comments/${commentId}`),
};
