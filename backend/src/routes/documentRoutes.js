const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { extractText } = require('../controllers/documentController');
const { analyzeDocument } = require('../controllers/analysisController');

router.post('/upload', upload.single('document'), extractText);
router.post('/analyze', analyzeDocument);

module.exports = router;