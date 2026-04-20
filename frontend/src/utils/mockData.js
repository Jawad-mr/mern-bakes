// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR DEMO MODE
// ═══════════════════════════════════════════════════════════════════════════════

export const mockProducts = [
  { _id: 'p1', name: 'Croissant', category: 'Pastry', price: 60, cost: 25, stock: 45, unit: 'pcs', description: 'Buttery French croissant' },
  { _id: 'p2', name: 'Chocolate Cake', category: 'Cake', price: 350, cost: 120, stock: 12, unit: 'pcs', description: 'Rich chocolate cake' },
  { _id: 'p3', name: 'Bread Loaf', category: 'Bread', price: 80, cost: 30, stock: 28, unit: 'pcs', description: 'Whole wheat bread loaf' },
  { _id: 'p4', name: 'Donut', category: 'Pastry', price: 40, cost: 15, stock: 60, unit: 'pcs', description: 'Glazed donut' },
  { _id: 'p5', name: 'Eclair', category: 'Pastry', price: 90, cost: 35, stock: 22, unit: 'pcs', description: 'Chocolate eclair' },
  { _id: 'p6', name: 'Macarons (Box)', category: 'Dessert', price: 200, cost: 70, stock: 8, unit: 'box', description: 'Assorted French macarons' },
  { _id: 'p7', name: 'Biscotti', category: 'Cookies', price: 120, cost: 45, stock: 35, unit: 'pcs', description: 'Crispy almond biscotti' },
  { _id: 'p8', name: 'Cappuccino', category: 'Beverage', price: 120, cost: 40, stock: 100, unit: 'cup', description: 'Espresso with steamed milk' },
]

export const mockPurchases = [
  { _id: 'pur1', product: 'p1', productName: 'Croissant', quantity: 50, costPrice: 25, totalCost: 1250, supplier: 'Flour Mills Ltd', date: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
  { _id: 'pur2', product: 'p2', productName: 'Chocolate Cake', quantity: 20, costPrice: 120, totalCost: 2400, supplier: 'Premium Bakery Supplies', date: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
  { _id: 'pur3', product: 'p3', productName: 'Bread Loaf', quantity: 40, costPrice: 30, totalCost: 1200, supplier: 'Flour Mills Ltd', date: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
  { _id: 'pur4', product: 'p4', productName: 'Donut', quantity: 100, costPrice: 15, totalCost: 1500, supplier: 'Quick Bakery Co', date: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
  { _id: 'pur5', product: 'p5', productName: 'Eclair', quantity: 30, costPrice: 35, totalCost: 1050, supplier: 'Premium Bakery Supplies', date: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
]

export const mockOrders = [
  { _id: 'ord1', items: [{ product: 'p1', productName: 'Croissant', qty: 2, price: 60, total: 120 }, { product: 'p8', productName: 'Cappuccino', qty: 2, price: 120, total: 240 }], subtotal: 360, gst: 64.8, total: 424.8, status: 'completed', createdAt: new Date(Date.now() - 6*60*60*1000).toISOString() },
  { _id: 'ord2', items: [{ product: 'p2', productName: 'Chocolate Cake', qty: 1, price: 350, total: 350 }], subtotal: 350, gst: 63, total: 413, status: 'completed', createdAt: new Date(Date.now() - 4*60*60*1000).toISOString() },
  { _id: 'ord3', items: [{ product: 'p3', productName: 'Bread Loaf', qty: 3, price: 80, total: 240 }, { product: 'p4', productName: 'Donut', qty: 5, price: 40, total: 200 }], subtotal: 440, gst: 79.2, total: 519.2, status: 'completed', createdAt: new Date(Date.now() - 2*60*60*1000).toISOString() },
  { _id: 'ord4', items: [{ product: 'p6', productName: 'Macarons (Box)', qty: 1, price: 200, total: 200 }], subtotal: 200, gst: 36, total: 236, status: 'pending', createdAt: new Date(Date.now() - 30*60*1000).toISOString() },
]

export const mockBillingData = {
  todayTotal: 1592.8,
  todayOrders: 4,
  thisMonthTotal: 45600,
  thisMonthOrders: 187,
  topProducts: [
    { name: 'Cappuccino', sold: 342, revenue: 41040 },
    { name: 'Croissant', sold: 156, revenue: 9360 },
    { name: 'Donut', sold: 289, revenue: 11560 },
  ],
}

export function initDemoData() {
  localStorage.setItem('sc_demo_products', JSON.stringify(mockProducts))
  localStorage.setItem('sc_demo_purchases', JSON.stringify(mockPurchases))
  localStorage.setItem('sc_demo_orders', JSON.stringify(mockOrders))
  localStorage.setItem('sc_demo_billing', JSON.stringify(mockBillingData))
}

export function getDemoData(type) {
  const data = localStorage.getItem(`sc_demo_${type}`)
  return data ? JSON.parse(data) : null
}

export function isDemoMode() {
  return localStorage.getItem('sc_is_demo') === 'true'
}

export function addDemoProduct(product) {
  const products = getDemoData('products') || []
  const newProduct = { ...product, _id: 'p' + Date.now() }
  products.push(newProduct)
  localStorage.setItem('sc_demo_products', JSON.stringify(products))
  return newProduct
}

export function updateDemoProduct(id, updates) {
  const products = getDemoData('products') || []
  const idx = products.findIndex(p => p._id === id)
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...updates }
    localStorage.setItem('sc_demo_products', JSON.stringify(products))
  }
  return products[idx] || null
}

export function deleteDemoProduct(id) {
  const products = getDemoData('products') || []
  const filtered = products.filter(p => p._id !== id)
  localStorage.setItem('sc_demo_products', JSON.stringify(filtered))
}

export function addDemoPurchase(purchase) {
  const purchases = getDemoData('purchases') || []
  const newPurchase = { ...purchase, _id: 'pur' + Date.now(), date: new Date().toISOString() }
  purchases.push(newPurchase)
  localStorage.setItem('sc_demo_purchases', JSON.stringify(purchases))
  return newPurchase
}

export function updateDemoPurchase(id, updates) {
  const purchases = getDemoData('purchases') || []
  const idx = purchases.findIndex(p => p._id === id)
  if (idx >= 0) {
    purchases[idx] = { ...purchases[idx], ...updates }
    localStorage.setItem('sc_demo_purchases', JSON.stringify(purchases))
  }
  return purchases[idx] || null
}

export function deleteDemoPurchase(id) {
  const purchases = getDemoData('purchases') || []
  const filtered = purchases.filter(p => p._id !== id)
  localStorage.setItem('sc_demo_purchases', JSON.stringify(filtered))
}

export function addDemoOrder(order) {
  const orders = getDemoData('orders') || []
  const newOrder = { ...order, _id: 'ord' + Date.now(), createdAt: new Date().toISOString() }
  orders.push(newOrder)
  localStorage.setItem('sc_demo_orders', JSON.stringify(orders))
  return newOrder
}

export function deleteDemoOrder(id) {
  const orders = getDemoData('orders') || []
  const filtered = orders.filter(o => o._id !== id)
  localStorage.setItem('sc_demo_orders', JSON.stringify(filtered))
}
