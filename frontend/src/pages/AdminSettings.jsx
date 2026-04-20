import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { TopNav, BottomNav, Modal, ConfirmModal, toast } from '../components'
import { authAPI } from '../api/axios'

const EMPTY_EDIT = { name: '', email: '', role: 'Staff', isActive: true }

export default function AdminSettingsPage() {
  const { user, bakerySettings, refreshBakerySettings } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [bakeryName, setBakeryName] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [logoValue, setLogoValue] = useState(undefined)
  const [savingSettings, setSavingSettings] = useState(false)

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_EDIT)
  const [deleteUserId, setDeleteUserId] = useState(null)

  useEffect(() => {
    setBakeryName(bakerySettings?.bakeryName || 'SweetCrumb Bakery')
    setLogoPreview(bakerySettings?.logoUrl || '')
  }, [bakerySettings])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const r = await authAPI.getUsers()
      setUsers(r.data.data || [])
    } catch {
      toast('Failed to load users', 'error')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (isAdmin) loadUsers()
  }, [isAdmin])

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => (a.role === 'Admin' ? -1 : 1) - (b.role === 'Admin' ? -1 : 1)),
    [users]
  )

  const onSelectLogo = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file', 'error')
      return
    }
    if (file.size > 1024 * 1024 * 2) {
      toast('Logo must be under 2MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      setLogoPreview(dataUrl)
      setLogoValue(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const saveSettings = async () => {
    const cleanName = bakeryName.trim()
    if (!cleanName) {
      toast('Bakery name is required', 'error')
      return
    }

    setSavingSettings(true)
    try {
      await authAPI.updateSettings({
        bakeryName: cleanName,
        ...(logoValue !== undefined ? { logoUrl: logoValue } : {}),
      })
      await refreshBakerySettings()
      setLogoValue(undefined)
      toast('Settings updated', 'success')
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to save settings', 'error')
    } finally {
      setSavingSettings(false)
    }
  }

  const openEditUser = (u) => {
    setEditUser(u)
    setEditForm({
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: Boolean(u.isActive),
    })
  }

  const saveUser = async () => {
    if (!editUser) return
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast('Name and email are required', 'error')
      return
    }
    try {
      await authAPI.updateUser(editUser._id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        isActive: editForm.isActive,
      })
      toast('User updated', 'success')
      setEditUser(null)
      loadUsers()
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to update user', 'error')
    }
  }

  const removeUser = async () => {
    try {
      await authAPI.deleteUser(deleteUserId)
      toast('User deleted', 'success')
      setDeleteUserId(null)
      loadUsers()
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to delete user', 'error')
    }
  }

  if (!isAdmin) {
    return (
      <>
        <TopNav />
        <div className="page-wrap">
          <div className="role-guard">
            <div className="role-guard__icon">🔒</div>
            <div className="role-guard__title">Admin Access Required</div>
            Only admins can manage bakery settings and users.
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <div className="page-wrap">
        <div className="mb-16">
          <div className="page-title">Admin Settings</div>
          <div className="page-subtitle">Manage bakery branding and staff accounts</div>
        </div>

        <div className="settings-grid">
          <div className="card card-padded">
            <div className="section-title">Bakery Profile</div>
            <div className="form-group">
              <label className="form-label">Bakery Name</label>
              <input
                className="form-control"
                value={bakeryName}
                onChange={(e) => setBakeryName(e.target.value)}
                placeholder="SweetCrumb Bakery"
              />
            </div>
            <button className="btn btn-primary" onClick={saveSettings} disabled={savingSettings}>
              {savingSettings ? <span className="spinner" /> : 'Save Name'}
            </button>
          </div>

          <div className="card card-padded">
            <div className="section-title">Logo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div className="settings-logo-preview">
                {logoPreview ? <img src={logoPreview} alt="Bakery logo" /> : 'SC'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Upload Logo</div>
                <div className="text-xs text-soft">Square image recommended</div>
              </div>
            </div>
            <input type="file" accept="image/*" className="form-control" onChange={onSelectLogo} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveSettings} disabled={savingSettings}>
                {savingSettings ? <span className="spinner" /> : 'Update Logo'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setLogoPreview('')
                  setLogoValue('')
                }}
              >
                Remove Logo
              </button>
            </div>
          </div>
        </div>

        <div className="card card-padded">
          <div className="flex items-center justify-between mb-16" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>User Management</div>
            <span className="badge badge-gold">{users.length} users</span>
          </div>

          {loadingUsers ? (
            <div className="text-center" style={{ padding: 40 }}><span className="spinner" /></div>
          ) : sortedUsers.length === 0 ? (
            <div className="empty-state" style={{ padding: 30 }}>
              <div className="empty-state__icon">👤</div>
              <div className="empty-state__title">No users found</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}{u._id === user._id ? ' (You)' : ''}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-blue">{u.role}</span></td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <div className="settings-user-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditUser(u)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteUserId(u._id)} disabled={u._id === user._id}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editUser && (
        <Modal title="Edit User" onClose={() => setEditUser(null)}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
              {['Admin', 'Cashier', 'Staff'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-control" value={String(editForm.isActive)} onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.value === 'true' }))}>
              <option value="true">Active</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-full" onClick={saveUser}>Save Changes</button>
            <button className="btn btn-ghost btn-full" onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {deleteUserId && (
        <ConfirmModal
          title="Delete User?"
          desc="This action permanently removes the user account."
          onConfirm={removeUser}
          onClose={() => setDeleteUserId(null)}
        />
      )}

      <BottomNav />
    </>
  )
}
