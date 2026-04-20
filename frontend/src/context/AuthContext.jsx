import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { initDemoData } from '../utils/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme]     = useState(() => localStorage.getItem('sc_theme') || 'light')
  const [bakerySettings, setBakerySettings] = useState({ bakeryName: 'SweetCrumb Bakery', logoUrl: '' })

  const fetchSettings = async () => {
    try {
      const r = await api.get('/auth/settings')
      setBakerySettings({
        bakeryName: r.data?.data?.bakeryName || 'SweetCrumb Bakery',
        logoUrl: r.data?.data?.logoUrl || '',
      })
      return r.data?.data
    } catch {
      return null
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sc_theme', theme)
  }, [theme])

  useEffect(() => {
    const token = localStorage.getItem('sc_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(async r => {
          setUser(r.data.user)
          await fetchSettings()
        })
        .catch(() => { localStorage.removeItem('sc_token'); delete api.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    const { token, user } = r.data
    localStorage.setItem('sc_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    await fetchSettings()
    return user
  }

  const demoLogin = async (email) => {
    const demoUsers = {
      'admin@sweetcrumb.in': { _id: 'demo-admin', name: 'Arjun Sharma', email: 'admin@sweetcrumb.in', role: 'Admin', isActive: true },
      'cashier@sweetcrumb.in': { _id: 'demo-cashier', name: 'Priya Menon', email: 'cashier@sweetcrumb.in', role: 'Cashier', isActive: true },
      'staff@sweetcrumb.in': { _id: 'demo-staff', name: 'Ravi Kumar', email: 'staff@sweetcrumb.in', role: 'Staff', isActive: true },
    }
    const user = demoUsers[email]
    if (!user) throw new Error('Demo user not found')
    
    initDemoData()
    const token = 'demo-token-' + Date.now()
    localStorage.setItem('sc_token', token)
    localStorage.setItem('sc_is_demo', 'true')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    setBakerySettings({ bakeryName: 'SweetCrumb Bakery (Demo)', logoUrl: '' })
    return user
  }

  const register = async (name, email, password, role) => {
    const r = await api.post('/auth/register', { name, email, password, role })
    const { token, user } = r.data
    localStorage.setItem('sc_token', token)
    localStorage.removeItem('sc_is_demo')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    await fetchSettings()
    return user
  }

  const logout = () => {
    localStorage.removeItem('sc_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setBakerySettings({ bakeryName: 'SweetCrumb Bakery', logoUrl: '' })
  }

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const can = (role) => {
    const levels = { Admin: 3, Cashier: 2, Staff: 1 }
    return (levels[user?.role] || 0) >= (levels[role] || 0)
  }

  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        theme,
        toggleTheme,
        can,
        initials,
        bakerySettings,
        refreshBakerySettings: fetchSettings,
        setBakerySettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
