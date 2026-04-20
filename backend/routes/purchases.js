const express = require('express');
const r = express.Router();
const c = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');

r.post('/',      protect, c.createPurchase);
r.put('/:id',    protect, c.updatePurchase);
r.get('/',       protect, c.getPurchases);
r.delete('/:id', protect, c.deletePurchase);

module.exports = r;
