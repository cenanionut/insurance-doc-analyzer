const mongoose = require('mongoose');

const UsageStatsSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // format: YYYY-MM-DD
    totalAnalyses: { type: Number, default: 0 },
});

module.exports = mongoose.model('UsageStats', UsageStatsSchema);