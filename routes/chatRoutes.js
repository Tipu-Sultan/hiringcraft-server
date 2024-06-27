const express = require('express');
const {
  startChat,
  sendMessage,
  getChatMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, startChat);
router.route('/:id/messages').get(protect, getChatMessages);
router.route('/messages').post(protect, sendMessage);

module.exports = router;