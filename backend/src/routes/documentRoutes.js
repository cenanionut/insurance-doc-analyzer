const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { extractText } = require('../controllers/documentController');
const { analyzeDocument } = require('../controllers/analysisController');
const { analysisLimiter } = require('../middleware/rateLimiter.cjs');
const { checkDailyCap } = require('../middleware/usageLimiter.cjs');

router.post('/upload', upload.single('document'), extractText);
router.post('/analyze', analysisLimiter, checkDailyCap, analyzeDocument);

module.exports = router;