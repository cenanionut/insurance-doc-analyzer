const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ConversationSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: true
    },
    documentContent: {
        type: String,
        required: true
    },
    analysis: {
        summary: String,
        productType: String,
        keyClauses: [String],
        complexityScore: Number
    },
    messages: [MessageSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);