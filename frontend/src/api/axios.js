import axios from 'axios'
import { getDemoData, isDemoMode, addDemoProduct, updateDemoProduct, deleteDemoProduct, addDemoPurchase, updateDemoPurchase, deleteDemoPurchase, addDemoOrder, deleteDemoOrder } from '../utils/mockData'

const remoteBase = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')}/api`
  : null

const api = axios.create({ baseURL: remoteBase || '/api' })

// ─── DEMO MODE INTERCEPTOR ───────────────────────────────────────────────────
api.interceptors.request.use(config => {
  if (!isDemoMode()) return config
  
  const method = config.method.toUpperCase()
  const url = config.url
  
  // GET requests - return mock data
  if (method === 'GET') {
    if (url.includes('/products')) {
      const products = getDemoData('products') || []
      return Promise.resolve({ data: { success: true, data: products } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
    if (url.includes('/purchases')) {
      const purchases = getDemoData('purchases') || []
      return Promise.resolve({ data: { success: true, data: purchases } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
    if (url.includes('/orders')) {
      const orders = getDemoData('orders') || []
      return Promise.resolve({ data: { success: true, data: orders } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
    if (url.includes('/billing')) {
      const billing = getDemoData('billing') || {}
      return Promise.resolve({ data: { success: true, data: billing } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
  }
  
  // POST requests - create mock items
  if (method === 'POST') {
    if (url.includes('/products')) {
      const newItem = addDemoProduct(config.data)
      return Promise.resolve({ data: { success: true, data: newItem } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
    if (url.includes('/purchases')) {
      const newItem = addDemoPurchase(config.data)
      return Promise.resolve({ data: { success: true, data: newItem } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
    if (url.includes('/orders')) {
      const newItem = addDemoOrder(config.data)
      return Promise.resolve({ data: { success: true, data: newItem } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
  }
  
  // PUT requests - update mock items
  if (method === 'PUT') {
    const idMatch = url.match(/\/(products|purchases)\/([a-zA-Z0-9]+)/)
    if (idMatch) {
      const type = idMatch[1].replace('s', '')
      const id = idMatch[2]
      const updateFn = type === 'product' ? updateDemoProduct : updateDemoPurchase
      const updated = updateFn(id, config.data)
      return Promise.resolve({ data: { success: true, data: updated } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
  }
  
  // DELETE requests - remove mock items
  if (method === 'DELETE') {
    const idMatch = url.match(/\/(products|purchases|orders)\/([a-zA-Z0-9]+)/)
    if (idMatch) {
      const type = idMatch[1].replace('s', '')
      const id = idMatch[2]
      if (type === 'product') deleteDemoProduct(id)
      else if (type === 'purchase') deleteDemoPurchase(id)
      else if (type === 'order') deleteDemoOrder(id)
      return Promise.resolve({ data: { success: true, message: 'Deleted' } }).then(r => {
        config._mockResponse = r.data
        return config
      })
    }
  }
  
  return config
}, err => Promise.reject(err))

api.interceptors.response.use(res => {
  if (res.config._mockResponse) {
    res.data = res.config._mockResponse
  }
  return res
}, err => Promise.reject(err))

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
