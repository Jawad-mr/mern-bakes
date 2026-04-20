// routes/auth.js
const express = require('express');
const router  = express.Router();
const {
	register,
	login,
	getMe,
	getUsers,
	updateUser,
	deleteUser,
	getSettings,
	updateSettings,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);
router.get('/settings',  protect, getSettings);
router.put('/settings',  protect, authorize('Admin'), updateSettings);
router.get('/users',     protect, authorize('Admin'), getUsers);
router.put('/users/:id', protect, authorize('Admin'), updateUser);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
