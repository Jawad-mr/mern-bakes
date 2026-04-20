const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const BakerySettings = require('../models/BakerySettings');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: role || 'Staff' });
    res.status(201).json({ success: true, token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account disabled' });
    res.json({ success: true, token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// GET /api/auth/users  (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/users/:id  (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email: String(email).toLowerCase() });
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
      user.email = String(email).toLowerCase().trim();
    }

    if (name !== undefined) user.name = String(name).trim();
    if (role && ['Admin', 'Cashier', 'Staff'].includes(role)) user.role = role;

    if (isActive !== undefined) {
      const selfEdit = req.params.id === req.user._id.toString();
      if (selfEdit && !isActive) {
        return res.status(400).json({ success: false, message: 'Cannot disable your own account' });
      }
      user.isActive = Boolean(isActive);
    }

    await user.save();
    res.json({ success: true, data: user, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/auth/users/:id (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/settings
exports.getSettings = async (_, res) => {
  try {
    let settings = await BakerySettings.findOne();
    if (!settings) settings = await BakerySettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { bakeryName, logoUrl } = req.body;
    let settings = await BakerySettings.findOne();
    if (!settings) settings = await BakerySettings.create({});

    if (bakeryName !== undefined) {
      const cleanName = String(bakeryName).trim();
      if (!cleanName) return res.status(400).json({ success: false, message: 'Bakery name is required' });
      settings.bakeryName = cleanName;
    }

    if (logoUrl !== undefined) settings.logoUrl = String(logoUrl || '');
    settings.updatedBy = req.user._id;

    await settings.save();
    res.json({ success: true, data: settings, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
