const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

// POST /api/purchases
exports.createPurchase = async (req, res) => {
  try {
    const { productId, qtyAdded, costPrice, notes } = req.body;
    const qty = Number(qtyAdded);
    const cp = Number(costPrice);

    if (!productId || !Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Valid product and quantity are required' });
    }

    if (!Number.isFinite(cp) || cp < 0) {
      return res.status(400).json({ success: false, message: 'Valid cost price is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.stock = Number(product.stock || 0) + qty;
    product.costPrice = cp;
    await product.save();

    const purchase = await Purchase.create({
      product: product._id,
      productName: product.name,
      category: product.category,
      qtyAdded: qty,
      costPrice: cp,
      totalCost: qty * cp,
      addedBy: req.user._id,
      addedByName: req.user.name,
      notes: notes ? String(notes).trim() : '',
    });

    res.status(201).json({ success: true, data: purchase, product, message: 'Purchase added and stock updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/purchases/:id
exports.updatePurchase = async (req, res) => {
  try {
    const { qtyAdded, costPrice, notes } = req.body;
    const qty = Number(qtyAdded);
    const cp = Number(costPrice);

    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }
    if (!Number.isFinite(cp) || cp < 0) {
      return res.status(400).json({ success: false, message: 'Valid cost price is required' });
    }

    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });

    const product = await Product.findById(purchase.product);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const qtyDiff = qty - Number(purchase.qtyAdded || 0);
    const nextStock = Number(product.stock || 0) + qtyDiff;
    if (nextStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot become negative after edit' });
    }

    product.stock = nextStock;
    product.costPrice = cp;
    await product.save();

    purchase.qtyAdded = qty;
    purchase.costPrice = cp;
    purchase.totalCost = qty * cp;
    purchase.notes = notes ? String(notes).trim() : '';
    await purchase.save();

    res.json({ success: true, data: purchase, product, message: 'Purchase updated and stock adjusted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/purchases
exports.getPurchases = async (req, res) => {
  try {
    const { range, search, page = 1, limit = 20 } = req.query;
    let query = {};
    const now = new Date();

    if (range === 'today') {
      const s = new Date(now); s.setHours(0,0,0,0);
      const e = new Date(now); e.setHours(23,59,59,999);
      query.createdAt = { $gte: s, $lte: e };
    } else if (range === 'month') {
      query.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    } else if (range === 'year') {
      query.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
    }

    if (search) query.$or = [
      { productName: { $regex: search, $options: 'i' } },
      { purchaseId:  { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [purchases, total] = await Promise.all([
      Purchase.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      Purchase.countDocuments(query),
    ]);

    // Stats
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
    const todayPurchases = await Purchase.find({ createdAt: { $gte: todayStart } });
    const todayCost = todayPurchases.reduce((s,p) => s + p.totalCost, 0);

    res.json({
      success: true,
      data: purchases,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      todayStats: { count: todayPurchases.length, totalCost: todayCost },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/purchases/:id
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });

    const product = await Product.findById(purchase.product);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const nextStock = Number(product.stock || 0) - Number(purchase.qtyAdded || 0);
    if (nextStock < 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete purchase because stock would become negative' });
    }

    product.stock = nextStock;
    await product.save();

    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Purchase record deleted and stock adjusted', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
