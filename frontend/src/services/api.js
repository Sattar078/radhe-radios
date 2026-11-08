import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const TOKEN_KEY = 'radhe_auth_token';

/** Axios instance with auth header auto-injection */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap error messages from API responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth API ───────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (identifier, password) => api.post('/api/auth/login', { identifier, password }).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
};

// ─── Products API ───────────────────────────────────────────
export const productsApi = {
  list: ({ search = '', category = '' } = {}) =>
    api.get('/api/products', { params: { search, category } }).then((r) => r.data),
  get: (id) => api.get(`/api/products/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/products', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/products/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/products/${id}`).then((r) => r.data),
};

// ─── Inquiries API (User can create, edit, update, delete) ──
export const inquiriesApi = {
  list: () => api.get('/api/inquiries').then((r) => r.data),
  create: (data) => api.post('/api/inquiries', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/inquiries/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/inquiries/${id}`).then((r) => r.data),
};

// ─── Profile API ────────────────────────────────────────────
export const profileApi = {
  update: (data) => api.put('/api/profile', data).then((r) => r.data),
};

// ─── Contact & Dealership API ───────────────────────────────
export const contactApi = {
  send: (data) => api.post('/api/contact', data).then((r) => r.data),
  myMessages: () => api.get('/api/contact/my').then((r) => r.data),
};

// ─── Technical Blueprints & Downloads API ───────────────────
export const downloadsApi = {
  list: () => api.get('/api/downloads').then((r) => r.data),
  track: (id) => api.post(`/api/downloads/${id}/track`).then((r) => r.data),
};

// ─── DJ Customer Reviews API ────────────────────────────────
export const reviewsApi = {
  list: (productId) =>
    api.get('/api/reviews', { params: productId ? { productId } : {} }).then((r) => r.data),
  create: (data) => api.post('/api/reviews', data).then((r) => r.data),
};

// ─── Live Workshop Stats API ────────────────────────────────
export const statsApi = {
  get: () => api.get('/api/stats').then((r) => r.data),
};

// ─── Admin Control Center API ───────────────────────────────
export const adminApi = {
  overview: () => api.get('/api/admin/overview').then((r) => r.data),
  inquiries: () => api.get('/api/admin/inquiries').then((r) => r.data),
  updateInquiry: (id, data) => api.put(`/api/admin/inquiries/${id}`, data).then((r) => r.data),
  contacts: () => api.get('/api/admin/contacts').then((r) => r.data),
  updateContact: (id, data) => api.put(`/api/admin/contacts/${id}`, data).then((r) => r.data),
  users: () => api.get('/api/admin/users').then((r) => r.data),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }).then((r) => r.data),
  approveAdmin: (id) => api.post(`/api/admin/users/${id}/approve-admin`).then((r) => r.data),
  revokeAdmin: (id) => api.post(`/api/admin/users/${id}/revoke-admin`).then((r) => r.data),
  sales: () => api.get('/api/admin/sales').then((r) => r.data),
  notify: (data) => api.post('/api/admin/notify', data).then((r) => r.data),
  notifications: () => api.get('/api/admin/notifications').then((r) => r.data),
};

// ─── Token helpers ──────────────────────────────────────────
export const tokenHelper = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

export default api;
