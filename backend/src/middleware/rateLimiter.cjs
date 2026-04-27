const rateLimit = require('express-rate-limit');

const analysisLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many analysis requests from your IP. Please try again in an hour.'
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many chat messages from your IP. Please try again in an hour.'
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { analysisLimiter, chatLimiter };