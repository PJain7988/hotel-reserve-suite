const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPassword } = require('../controllers/bookingController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

router.get('/status', (req, res) => {
  res.json({ authenticated: true, role: 'admin' });
});

module.exports = router;
