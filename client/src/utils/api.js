import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export const birdsAPI = {
  getAll: (params) => api.get('/birds', { params }),
  getById: (id) => api.get(`/birds/${id}`),
  create: (data) => api.post('/birds', data),
  update: (id, data) => api.put(`/birds/${id}`, data),
  delete: (id) => api.delete(`/birds/${id}`),
  getComments: (birdId) => api.get(`/birds/${birdId}/comments`),
  addComment: (birdId, content) => api.post(`/birds/${birdId}/comments`, { content }),
  deleteComment: (commentId) => api.delete(`/birds/comments/${commentId}`),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const usersAPI = {
  getFavorites: () => api.get('/users/favorites'),
  toggleFavorite: (birdId) => api.post(`/users/favorites/${birdId}`),
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};

export default api;
