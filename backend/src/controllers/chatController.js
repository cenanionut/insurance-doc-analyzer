const model = require('../config/gemini');
const Conversation = require('../models/Conversation');

const chat = async (req, res) => {
    try {
        const { conversationId, question } = req.body;

        if (!conversationId || !question) {
            return res.status(400).json({ error: 'Missing conversationId or question' });
        }

        // Încarcă conversația din MongoDB
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Construiește history-ul pentru context
        const historyText = conversation.messages
            .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n');

        const prompt = `
You are an expert insurance document analyst. You have already analyzed a document and now answer follow-up questions about it.

Document name: ${conversation.documentName}

Document content:
"""
${conversation.documentContent.substring(0, 6000)}
"""

Previous analysis:
- Summary: ${conversation.analysis.summary}
- Product Type: ${conversation.analysis.productType}
- Complexity Score: ${conversation.analysis.complexityScore}/10

${historyText ? `Conversation history:\n${historyText}\n` : ''}
User question: ${question}

Answer clearly and concisely, referencing specific parts of the document where relevant.
`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        // Salvează întrebarea și răspunsul în MongoDB
        conversation.messages.push({ role: 'user', content: question });
        conversation.messages.push({ role: 'assistant', content: answer });
        await conversation.save();

        return res.json({ answer });

    } catch (error) {
        console.error('Chat error:', error.message);
        return res.status(500).json({ error: 'Failed to process question' });
    }
};

const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        return res.json(conversation);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

module.exports = { chat, getConversation };