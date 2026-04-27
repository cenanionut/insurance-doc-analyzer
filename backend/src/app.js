const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // necesar pentru cookies
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Insurance Doc Analyzer API running' });
});

app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;