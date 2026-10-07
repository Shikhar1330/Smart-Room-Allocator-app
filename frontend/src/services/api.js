import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const roomsAPI = {
  getAll: (params) => API.get('/rooms', { params }),
  getStats: () => API.get('/rooms/stats'),
  create: (data) => API.post('/rooms', data),
  update: (id, data) => API.put(`/rooms/${id}`, data),
  delete: (id) => API.delete(`/rooms/${id}`),
};

export const coursesAPI = {
  getAll: (params) => API.get('/courses', { params }),
  create: (data) => API.post('/courses', data),
  update: (id, data) => API.put(`/courses/${id}`, data),
  delete: (id) => API.delete(`/courses/${id}`),
};

export const allocationsAPI = {
  getAll: () => API.get('/allocations'),
  create: (data) => API.post('/allocations', data),
  autoAllocate: (data) => API.post('/allocations/auto', data),
  getConflicts: () => API.get('/allocations/conflicts'),
  resolve: (id) => API.patch(`/allocations/${id}/resolve`),
  delete: (id) => API.delete(`/allocations/${id}`),
};

export const usersAPI = {
  getAll: (params) => API.get('/users', { params }),
  getStats: () => API.get('/users/stats'),
  create: (data) => API.post('/users', data),
  updateStatus: (id, status) => API.patch(`/users/${id}/status`, { status }),
  delete: (id) => API.delete(`/users/${id}`),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getEvents: () => API.get('/dashboard/events'),
  getUtilization: () => API.get('/dashboard/utilization'),
};
