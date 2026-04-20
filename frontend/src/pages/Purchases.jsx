import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { TopNav, BottomNav, StatCard, Pagination, ConfirmModal, Modal, toast } from '../components'
import { purchaseAPI, productAPI } from '../api/axios'
import { isDemoMode, getDemoPurchases, getDemoProducts, addDemoPurchase, updateDemoPurchase, deleteDemoPurchase } from '../utils/mockData'
import { fmt, fmtDate, fmtTime } from '../utils/helpers'

export default function PurchasesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading]     = useState(true)
  const [range, setRange]         = useState('today')
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [pagination, setPag]      = useState({ total: 0, pages: 1 })
  const [todayStats, setTS]       = useState({ count: 0, totalCost: 0 })
  const [deleteId, setDeleteId]   = useState(null)
  const [products, setProducts]   = useState([])
  const [modal, setModal]         = useState(null) // null | 'add' | 'edit'
  const [editItem, setEditItem]   = useState(null)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState({ productId: '', qtyAdded: '', costPrice: '', notes: '' })

  const PER = 20

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      if (isDemoMode()) {
        const demoPurchases = getDemoPurchases()
        setPurchases(demoPurchases)
        setPag({ total: demoPurchases.length, pages: 1 })
        setTS({ count: demoPurchases.length, totalCost: demoPurchases.reduce((s, p) => s + Number(p.totalCost || 0), 0) })
        return
      }
      const params = { page, limit: PER }
      if (range) params.range = range
      if (search) params.search = search
      const r = await purchaseAPI.getAll(params)
      setPurchases(r.data.data)
      setPag({ total: r.data.total, pages: r.data.pages })
      setTS(r.data.todayStats)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchPurchases() }, [range, search, page])

  const fetchProducts = async () => {
    try {
      if (isDemoMode()) {
        setProducts(getDemoProducts())
        return
      }
      const r = await productAPI.getAll()
      setProducts(r.data.data || [])
    } catch {
      toast('Failed to load products', 'error')
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setForm({ productId: products?.[0]?._id || '', qtyAdded: '', costPrice: '', notes: '' })
    setEditItem(null)
    setModal('add')
  }

  const openEdit = (p) => {
    setEditItem(p)
    setForm({
      productId: p.product,
      qtyAdded: String(p.qtyAdded),
      costPrice: String(p.costPrice),
      notes: p.notes || '',
    })
    setModal('edit')
  }

  const handleSave = async () => {
    const qty = Number(form.qtyAdded)
    const cp = Number(form.costPrice)

    if (!form.productId) { toast('Please select a product', 'error'); return }
    if (!Number.isFinite(qty) || qty <= 0) { toast('Enter a valid quantity', 'error'); return }
    if (!Number.isFinite(cp) || cp < 0) { toast('Enter a valid cost', 'error'); return }

    setSaving(true)
    try {
      if (modal === 'add') {
        if (isDemoMode()) addDemoPurchase({ productId: form.productId, qtyAdded: qty, costPrice: cp, notes: form.notes })
        else await purchaseAPI.create({ productId: form.productId, qtyAdded: qty, costPrice: cp, notes: form.notes })
        toast('Purchase added and stock updated', 'success')
      } else {
        if (isDemoMode()) updateDemoPurchase(editItem._id, { qtyAdded: qty, costPrice: cp, notes: form.notes })
        else await purchaseAPI.update(editItem._id, { qtyAdded: qty, costPrice: cp, notes: form.notes })
        toast('Purchase updated and stock adjusted', 'success')
      }

      setModal(null)
      setEditItem(null)
      fetchPurchases()
      fetchProducts()
    } catch (e) {
      toast(e.response?.data?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      if (isDemoMode()) deleteDemoPurchase(deleteId)
      else await purchaseAPI.delete(deleteId)
      toast('Purchase deleted and stock adjusted', 'success')
      setDeleteId(null)
      fetchPurchases()
      fetchProducts()
    } catch (e) {
      toast(e.response?.data?.message || 'Delete failed', 'error')
    }
  }

  const totalCost = purchases.reduce((s, p) => s + p.totalCost, 0)
  const totalQty  = purchases.reduce((s, p) => s + p.qtyAdded, 0)

  const rangeOpts = [
    { id: 'today', label: 'Today' },
    ...(isAdmin ? [{ id: 'month', label: 'This Month' }, { id: 'year', label: 'This Year' }, { id: '', label: 'All Time' }] : []),
  ]

  return (
    <>
      <TopNav />
      <div className="page-wrap">
        <div className="flex items-center justify-between mb-16" style={{ flexWrap:'wrap', gap:12 }}>
          <div>
            <div className="page-title">🛒 Purchase List</div>
            <div className="page-subtitle">Manage inventory inflow from one place</div>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Purchase</button>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <StatCard label="Today's Purchases" value={todayStats.count} sub="restock entries" icon="🛒" accent="var(--c-gold)" />
          <StatCard label="Today's Cost" value={fmt(todayStats.totalCost)} sub="total spent today" icon="💸" accent="var(--c-danger)" />
          <StatCard label="This Page Total" value={fmt(totalCost)} sub={`${totalQty} units restocked`} icon="📦" accent="var(--c-info)" />
          <StatCard label="Entries" value={pagination.total} sub="total records" icon="📋" accent="#8b5cf6" />
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <div className="chip-group">
            {rangeOpts.map(o => (
              <button key={o.id} className={`chip${range===o.id?' active':''}`} onClick={() => { setRange(o.id); setPage(1) }}>{o.label}</button>
            ))}
          </div>
          <div className="search-wrap" style={{ maxWidth:200, flex:'unset' }}>
            <span className="search-icon">🔍</span>
            <input className="form-control" placeholder="Search product…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}><span className="spinner" style={{ width:32, height:32 }} /></div>
        ) : purchases.length === 0 ? (
          <div className="empty-state card card-padded">
            <div className="empty-state__icon">🛒</div>
            <div className="empty-state__title">No purchase records</div>
            <div className="empty-state__desc">Click Add Purchase to create your first inventory entry</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Purchase ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty Added</th>
                  <th>Cost / Unit</th>
                  <th>Total Cost</th>
                  <th>Added By</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(p => (
                  <tr key={p._id}>
                    <td><span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:'var(--c-gold)' }}>{p.purchaseId}</span></td>
                    <td>
                      <span style={{ fontWeight:600, fontSize:13 }}>{p.productName}</span>
                    </td>
                    <td><span className="badge badge-gold">{p.category}</span></td>
                    <td>
                      <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--c-success)' }}>+{p.qtyAdded}</span>
                    </td>
                    <td style={{ fontWeight:600 }}>{fmt(p.costPrice)}</td>
                    <td>
                      <span style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--c-text)' }}>{fmt(p.totalCost)}</span>
                    </td>
                    <td style={{ fontSize:13 }}>{p.addedByName}</td>
                    <td>
                      <div style={{ fontSize:12, fontWeight:600 }}>{fmtDate(p.createdAt)}</div>
                      <div style={{ fontSize:11, color:'var(--c-text-soft)' }}>{fmtTime(p.createdAt)}</div>
                    </td>
                    <td>
                      <span style={{ fontSize:11, color:'var(--c-text-soft)', maxWidth:140, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.notes || '—'}</span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <Pagination page={page} pages={pagination.pages} total={pagination.total} perPage={PER} onPage={setPage} />
        )}

        {/* Info box */}
        <div style={{ marginTop:20, background:'var(--c-gold-pale)', border:'1px solid rgba(200,144,42,.25)', borderRadius:'var(--radius-md)', padding:'14px 18px', fontSize:13, color:'var(--c-text-mid)' }}>
          <strong>ℹ️ How Purchase List works:</strong> Add, edit, and delete purchases here. Stock is adjusted automatically based on each purchase change.
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Purchase' : `Edit ${editItem?.purchaseId || 'Purchase'}`} onClose={() => setModal(null)}>
          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-control" value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} disabled={modal === 'edit'}>
              <option value="">Select product</option>
              {products.map(pr => (
                <option key={pr._id} value={pr._id}>{pr.name} ({pr.category})</option>
              ))}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" min="1" className="form-control" value={form.qtyAdded} onChange={e => setForm(f => ({ ...f, qtyAdded: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Cost / Unit (₹)</label>
              <input type="number" min="0" step="0.01" className="form-control" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea className="form-control" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" /> : modal === 'add' ? 'Add Purchase' : 'Save Changes'}
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Record?"
          desc="This removes the purchase log entry and updates stock accordingly."
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}

      <BottomNav />
    </>
  )
}
