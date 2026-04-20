const mongoose = require('mongoose');

const bakerySettingsSchema = new mongoose.Schema({
  bakeryName: { type: String, required: true, trim: true, default: 'SweetCrumb Bakery' },
  logoUrl: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('BakerySettings', bakerySettingsSchema);
