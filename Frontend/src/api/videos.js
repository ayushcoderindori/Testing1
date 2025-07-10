import api from "./axios.js";

// Video CRUD operations
export const fetchVideos = (params = {}) => api.get("/videos", { params }).then(r => r.data);
export const fetchVideo = (videoId) => api.get(`/videos/${videoId}`).then(r => r.data);
export const uploadVideo = (formData) => api.post("/videos", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`);
export const updateVideo = (videoId, data) => api.patch(`/videos/${videoId}`, data);

// Video interactions
export const likeVideo = (videoId) => api.post(`/likes/toggle/v/${videoId}`);
export const toggleVideoLike = (videoId) => api.post(`/likes/toggle/v/${videoId}`);

// Video stats and analytics
export const getVideoStats = (videoId) => api.get(`/videos/${videoId}/stats`).then(r => r.data);
export const getVideoComments = (videoId) => api.get(`/comments/${videoId}`).then(r => r.data);
export const addVideoComment = (videoId, content) => api.post(`/comments/${videoId}`, { content });

// AI-related functionality
export const fetchVideoAI = (videoId) => api.get(`/videos/${videoId}/ai`);
export const processVideoAI = (videoId) => api.post(`/videos/${videoId}/process-ai`);

// Dashboard and analytics
export const getDashboardStats = () => api.get("/dashboard/stats").then(r => r.data);
export const getChannelAnalytics = () => api.get("/dashboard/analytics").then(r => r.data);
