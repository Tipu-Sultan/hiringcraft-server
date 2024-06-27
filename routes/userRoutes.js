const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify-email').get(verifyEmail);
router.route('/forgot-password').post(forgotPassword).put(updatePassword);

module.exports = router;