const express = require('express');
const router = express.Router();
const { chat, getConversation } = require('../controllers/chatController');

router.post('/', chat);
router.get('/:id', getConversation);

module.exports = router;