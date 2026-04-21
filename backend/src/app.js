const express = require('express');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());

module.exports = app;

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Insurance Document Analyzer API is running.' })
});

app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;