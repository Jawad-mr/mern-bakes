// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR DEMO MODE
// ═══════════════════════════════════════════════════════════════════════════════

export const mockProducts = [
  { _id: 'p1', name: 'Croissant', category: 'Pastry', price: 60, costPrice: 25, stock: 45, unit: 'pcs', gstRate: 5, description: 'Buttery French croissant' },
  { _id: 'p2', name: 'Chocolate Cake', category: 'Cake', price: 350, costPrice: 120, stock: 12, unit: 'pcs', gstRate: 5, description: 'Rich chocolate cake' },
  { _id: 'p3', name: 'Bread Loaf', category: 'Bread', price: 80, costPrice: 30, stock: 28, unit: 'pcs', gstRate: 5, description: 'Whole wheat bread loaf' },
  { _id: 'p4', name: 'Donut', category: 'Pastry', price: 40, costPrice: 15, stock: 60, unit: 'pcs', gstRate: 5, description: 'Glazed donut' },
  { _id: 'p5', name: 'Eclair', category: 'Pastry', price: 90, costPrice: 35, stock: 22, unit: 'pcs', gstRate: 5, description: 'Chocolate eclair' },
  { _id: 'p6', name: 'Macarons (Box)', category: 'Dessert', price: 200, costPrice: 70, stock: 8, unit: 'box', gstRate: 5, description: 'Assorted French macarons' },
  { _id: 'p7', name: 'Biscotti', category: 'Cookies', price: 120, costPrice: 45, stock: 35, unit: 'pcs', gstRate: 5, description: 'Crispy almond biscotti' },
  { _id: 'p8', name: 'Cappuccino', category: 'Beverage', price: 120, costPrice: 40, stock: 100, unit: 'cup', gstRate: 5, description: 'Espresso with steamed milk' },
]

export const mockPurchases = [
  { _id: 'pur1', purchaseId: 'PUR-1001', product: 'p1', productName: 'Croissant', category: 'Pastry', qtyAdded: 50, costPrice: 25, totalCost: 1250, addedByName: 'Arjun Sharma', notes: 'Flour Mills Ltd', createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
  { _id: 'pur2', purchaseId: 'PUR-1002', product: 'p2', productName: 'Chocolate Cake', category: 'Cake', qtyAdded: 20, costPrice: 120, totalCost: 2400, addedByName: 'Priya Menon', notes: 'Premium Bakery Supplies', createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
  { _id: 'pur3', purchaseId: 'PUR-1003', product: 'p3', productName: 'Bread Loaf', category: 'Bread', qtyAdded: 40, costPrice: 30, totalCost: 1200, addedByName: 'Arjun Sharma', notes: 'Flour Mills Ltd', createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
  { _id: 'pur4', purchaseId: 'PUR-1004', product: 'p4', productName: 'Donut', category: 'Pastry', qtyAdded: 100, costPrice: 15, totalCost: 1500, addedByName: 'Ravi Kumar', notes: 'Quick Bakery Co', createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
  { _id: 'pur5', purchaseId: 'PUR-1005', product: 'p5', productName: 'Eclair', category: 'Pastry', qtyAdded: 30, costPrice: 35, totalCost: 1050, addedByName: 'Priya Menon', notes: 'Premium Bakery Supplies', createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
]

export const mockOrders = [
  { _id: 'ord1', orderId: 'ORD-2001', customer: 'Ayaan Khan', phone: '9876543210', items: [{ productId: 'p1', name: 'Croissant', qty: 2, price: 60, subtotal: 120 }, { productId: 'p8', name: 'Cappuccino', qty: 2, price: 120, subtotal: 240 }], subtotal: 360, gstAmount: 18, total: 378, method: 'Cash', cashierName: 'Priya Menon', createdAt: new Date(Date.now() - 6*60*60*1000).toISOString() },
  { _id: 'ord2', orderId: 'ORD-2002', customer: 'Sara Ahmed', phone: '9988776655', items: [{ productId: 'p2', name: 'Chocolate Cake', qty: 1, price: 350, subtotal: 350 }], subtotal: 350, gstAmount: 17.5, total: 367.5, method: 'Online', cashierName: 'Arjun Sharma', createdAt: new Date(Date.now() - 4*60*60*1000).toISOString() },
  { _id: 'ord3', orderId: 'ORD-2003', customer: 'Rahul Verma', phone: '9123456780', items: [{ productId: 'p3', name: 'Bread Loaf', qty: 3, price: 80, subtotal: 240 }, { productId: 'p4', name: 'Donut', qty: 5, price: 40, subtotal: 200 }], subtotal: 440, gstAmount: 22, total: 462, method: 'Cash', cashierName: 'Ravi Kumar', createdAt: new Date(Date.now() - 2*60*60*1000).toISOString() },
  { _id: 'ord4', orderId: 'ORD-2004', customer: 'Walk-in', phone: '', items: [{ productId: 'p6', name: 'Macarons (Box)', qty: 1, price: 200, subtotal: 200 }], subtotal: 200, gstAmount: 10, total: 210, method: 'Online', cashierName: 'Priya Menon', createdAt: new Date(Date.now() - 30*60*1000).toISOString() },
]

export const mockBillingData = {
  todayTotal: 1417.5,
  todayOrders: 4,
  thisMonthTotal: 45600,
  thisMonthOrders: 187,
  topProducts: [
    { name: 'Cappuccino', sold: 342, revenue: 41040 },
    { name: 'Croissant', sold: 156, revenue: 9360 },
    { name: 'Donut', sold: 289, revenue: 11560 },
  ],
}

const read = (key, fallback) => {
  const data = localStorage.getItem(`sc_demo_${key}`)
  return data ? JSON.parse(data) : fallback
}

const write = (key, value) => {
  localStorage.setItem(`sc_demo_${key}`, JSON.stringify(value))
}

export function isDemoMode() {
  return localStorage.getItem('sc_is_demo') === 'true'
}

export function initDemoData() {
  if (!localStorage.getItem('sc_demo_products')) write('products', mockProducts)
  if (!localStorage.getItem('sc_demo_purchases')) write('purchases', mockPurchases)
  if (!localStorage.getItem('sc_demo_orders')) write('orders', mockOrders)
  if (!localStorage.getItem('sc_demo_billing')) write('billing', mockBillingData)
}

export function getDemoData(type) {
  return read(type, [])
}

export function getDemoBillingData() {
  return read('billing', mockBillingData)
}

export function getDemoProducts() {
  return read('products', mockProducts)
}

export function getDemoPurchases() {
  return read('purchases', mockPurchases)
}

export function getDemoOrders() {
  return read('orders', mockOrders)
}

export function getDemoOrderStats() {
  const orders = getDemoOrders()
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const gst = orders.reduce((sum, order) => sum + Number(order.gstAmount || 0), 0)
  return {
    today: { orders: orders.length, revenue, gst },
    month: { orders: 187, revenue: 45600, gst: 2280 },
    year: { orders: 2084, revenue: 498400, gst: 24920 },
    charts: {
      last7: [
        { label: 'Mon', v: 5400 },
        { label: 'Tue', v: 3900 },
        { label: 'Wed', v: 6200 },
        { label: 'Thu', v: 4800 },
        { label: 'Fri', v: 7150 },
        { label: 'Sat', v: 8900 },
        { label: 'Sun', v: 6100 },
      ],
      last6m: [
        { label: 'Nov', v: 64000 },
        { label: 'Dec', v: 71000 },
        { label: 'Jan', v: 68000 },
        { label: 'Feb', v: 73500 },
        { label: 'Mar', v: 81200 },
        { label: 'Apr', v: 90800 },
      ],
    },
  }
}

export function getDemoTodayPurchaseStats() {
  const purchases = getDemoPurchases()
  return {
    count: purchases.length,
    totalCost: purchases.reduce((sum, purchase) => sum + Number(purchase.totalCost || 0), 0),
  }
}

export function addDemoProduct(product) {
  const products = getDemoProducts()
  const newProduct = {
    _id: 'p' + Date.now(),
    name: product.name,
    category: product.category,
    price: Number(product.price || 0),
    costPrice: Number(product.costPrice || 0),
    stock: Number(product.stock || 0),
    unit: product.unit || 'pcs',
    gstRate: Number(product.gstRate || 5),
    description: product.description || '',
  }
  products.push(newProduct)
  write('products', products)
  return newProduct
}

export function updateDemoProduct(id, updates) {
  const products = getDemoProducts()
  const idx = products.findIndex(p => p._id === id)
  if (idx >= 0) {
    products[idx] = {
      ...products[idx],
      ...updates,
      price: Number(updates.price ?? products[idx].price),
      costPrice: Number(updates.costPrice ?? products[idx].costPrice),
      stock: Number(updates.stock ?? products[idx].stock),
      gstRate: Number(updates.gstRate ?? products[idx].gstRate),
    }
    write('products', products)
  }
  return products[idx] || null
}

export function deleteDemoProduct(id) {
  const products = getDemoProducts()
  const filtered = products.filter(p => p._id !== id)
  write('products', filtered)
}

export function addDemoPurchase(purchase) {
  const purchases = getDemoPurchases()
  const products = getDemoProducts()
  const product = products.find(p => p._id === purchase.productId)
  const newPurchase = {
    _id: 'pur' + Date.now(),
    purchaseId: `PUR-${1000 + purchases.length + 1}`,
    product: purchase.productId,
    productName: product?.name || purchase.productName || 'Product',
    category: product?.category || purchase.category || 'Other',
    qtyAdded: Number(purchase.qtyAdded || 0),
    costPrice: Number(purchase.costPrice || 0),
    totalCost: Number(purchase.qtyAdded || 0) * Number(purchase.costPrice || 0),
    addedByName: 'Demo User',
    notes: purchase.notes || '',
    createdAt: new Date().toISOString(),
  }
  purchases.push(newPurchase)
  if (product) {
    product.stock = Number(product.stock || 0) + Number(purchase.qtyAdded || 0)
    write('products', products)
  }
  write('purchases', purchases)
  return newPurchase
}

export function updateDemoPurchase(id, updates) {
  const purchases = getDemoPurchases()
  const idx = purchases.findIndex(p => p._id === id)
  if (idx >= 0) {
    purchases[idx] = {
      ...purchases[idx],
      ...updates,
      qtyAdded: Number(updates.qtyAdded ?? purchases[idx].qtyAdded),
      costPrice: Number(updates.costPrice ?? purchases[idx].costPrice),
      totalCost: Number(updates.qtyAdded ?? purchases[idx].qtyAdded) * Number(updates.costPrice ?? purchases[idx].costPrice),
    }
    write('purchases', purchases)
  }
  return purchases[idx] || null
}

export function deleteDemoPurchase(id) {
  const purchases = getDemoPurchases()
  const filtered = purchases.filter(p => p._id !== id)
  write('purchases', filtered)
}

export function addDemoOrder(order) {
  const orders = getDemoOrders()
  const products = getDemoProducts()
  const normalizedItems = (order.items || []).map(item => ({
    productId: item.productId,
    name: item.name,
    qty: Number(item.qty || 0),
    price: Number(item.price || 0),
    subtotal: Number(item.subtotal || item.qty * item.price || 0),
  }))
  const newOrder = {
    _id: 'ord' + Date.now(),
    orderId: `ORD-${2000 + orders.length + 1}`,
    customer: order.customer || 'Walk-in',
    phone: order.phone || '',
    items: normalizedItems,
    subtotal: Number(order.subtotal || normalizedItems.reduce((sum, item) => sum + item.subtotal, 0)),
    gstAmount: Number(order.gstAmount || order.gst || 0),
    total: Number(order.total || 0),
    method: order.method || 'Cash',
    cashierName: order.cashierName || 'Demo Cashier',
    createdAt: new Date().toISOString(),
  }
  products.forEach(product => {
    const sold = normalizedItems.find(item => item.productId === product._id)
    if (sold) product.stock = Math.max(0, Number(product.stock || 0) - Number(sold.qty || 0))
  })
  orders.push(newOrder)
  write('products', products)
  write('orders', orders)
  return newOrder
}

export function deleteDemoOrder(id) {
  const orders = getDemoOrders()
  const filtered = orders.filter(o => o._id !== id)
  write('orders', filtered)
}
