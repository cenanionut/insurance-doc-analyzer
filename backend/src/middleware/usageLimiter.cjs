const UsageStats = require('../models/UsageStats');

const DAILY_CAP = 20;          // max analize globale/zi
const SESSION_MAX_CHATS = 10;  // max mesaje chat per sesiune

const getTodayKey = () => new Date().toISOString().split('T')[0];

// Verifică + incrementează daily cap (folosit la analiză)
const checkDailyCap = async (req, res, next) => {
    try {
        const today = getTodayKey();
        const stats = await UsageStats.findOneAndUpdate(
            { date: today },
            { $setOnInsert: { date: today, totalAnalyses: 0 } },
            { upsert: true, new: true }
        );

        if (stats.totalAnalyses >= DAILY_CAP) {
            return res.status(503).json({
                error: `Daily analysis limit reached (${DAILY_CAP}/day). The service will resume tomorrow.`
            });
        }

        // Incrementăm după ce analiza reușește — attached la req pentru controller
        req.incrementDailyCount = async () => {
            await UsageStats.updateOne({ date: today }, { $inc: { totalAnalyses: 1 } });
        };

        next();
    } catch (err) {
        console.error('Usage limiter error:', err.message);
        next(); // fail open — nu blocăm dacă DB are probleme
    }
};

// Verifică session chat limit (cookie-based)
const checkSessionChatLimit = (req, res, next) => {
    const sessionData = req.cookies?.session_usage;
    let usage = {};

    try {
        usage = sessionData ? JSON.parse(sessionData) : {};
    } catch {
        usage = {};
    }

    const { conversationId } = req.body;
    const key = `chat_${conversationId}`;
    const count = usage[key] || 0;

    if (count >= SESSION_MAX_CHATS) {
        return res.status(429).json({
            error: `Session limit reached (${SESSION_MAX_CHATS} messages per document). Please upload a new document to continue.`
        });
    }

    // Atașăm funcția de increment la req
    req.incrementSessionChat = (res) => {
        usage[key] = count + 1;
        res.cookie('session_usage', JSON.stringify(usage), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 ore
            sameSite: 'lax',
        });
    };

    next();
};

module.exports = { checkDailyCap, checkSessionChatLimit };