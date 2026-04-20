import axios from 'axios'

const remoteBase = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')}/api`
  : null

const api = axios.create({ baseURL: remoteBase || '/api' })

export default api

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:      (data) => api.post('/auth/login', data),
  register:   (data) => api.post('/auth/register', data),
  me:         ()     => api.get('/auth/me'),
  getSettings:()     => api.get('/auth/settings'),
  updateSettings:(data) => api.put('/auth/settings', data),
  getUsers:   ()     => api.get('/auth/users'),
  updateUser: (id,data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id)   => api.delete(`/auth/users/${id}`),
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:   (params) => api.get('/products', { params }),
  create:   (data)   => api.post('/products', data),
  update:   (id,data)=> api.put(`/products/${id}`, data),
  delete:   (id)     => api.delete(`/products/${id}`),
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  getAll:   (params) => api.get('/orders', { params }),
  getStats: ()       => api.get('/orders/stats'),
  create:   (data)   => api.post('/orders', data),
  delete:   (id)     => api.delete(`/orders/${id}`),
}

// ── PURCHASES ─────────────────────────────────────────────────────────────────
export const purchaseAPI = {
  create:   (data)   => api.post('/purchases', data),
  update:   (id,data)=> api.put(`/purchases/${id}`, data),
  getAll:   (params) => api.get('/purchases', { params }),
  delete:   (id)     => api.delete(`/purchases/${id}`),
}
