const express = require('express');
const router = express.Router();
const { chat, getConversation } = require('../controllers/chatController');
const { chatLimiter } = require('../middleware/rateLimiter.cjs');
const { checkSessionChatLimit } = require('../middleware/usageLimiter.cjs');

router.post('/', chatLimiter, checkSessionChatLimit, chat);
router.get('/:id', getConversation);

module.exports = router;