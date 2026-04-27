const model = require('../config/gemini');
const Conversation = require('../models/Conversation');

const analyzeDocument = async (req, res) => {
    try {
        const { text, fileName } = req.body;

        if (!text || !fileName) {
            return res.status(400).json({ error: 'Missing text or fileName' });
        }

        const prompt = `
You are an expert insurance document analyst. Analyze the following insurance document and respond ONLY with a valid JSON object — no markdown, no code blocks, no extra text.

Document:
"""
${text.substring(0, 8000)}
"""

Respond with exactly this JSON structure:
{
  "summary": "A clear 3-5 sentence summary of the document",
  "productType": "The type of insurance product (e.g. Property Insurance, Liability Insurance, Marine Cargo, Professional Indemnity, etc.)",
  "keyClauses": [
    "First important clause or condition",
    "Second important clause or condition",
    "Third important clause or condition",
    "Fourth important clause or condition",
    "Fifth important clause or condition"
  ],
  "complexityScore": 7
}

complexityScore must be an integer from 1 (very simple) to 10 (extremely complex).
`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        let analysis;
        try {
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            analysis = JSON.parse(cleaned);
        } catch (e) {
            return res.status(500).json({ error: 'AI returned invalid JSON', raw: rawText });
        }

        // Salvează în MongoDB
        const conversation = await Conversation.create({
            documentName: fileName,
            documentContent: text,
            analysis,
            messages: []
        });

        if (req.incrementDailyCount) {
            await req.incrementDailyCount();
        }

        return res.json({
            conversationId: conversation._id,
            analysis
        });

    } catch (error) {
        console.error('Analysis error:', error.message);

        if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
            return res.status(503).json({
                error: 'Gemini AI is currently experiencing high demand. Please wait 30 seconds and try again.'
            });
        }

        if (error.message?.includes('429') || error.message?.includes('quota')) {
            return res.status(429).json({
                error: 'API rate limit reached. Please wait a minute before trying again.'
            });
        }

        return res.status(500).json({ error: 'Failed to analyze document. Please try again.' });
    }
};

module.exports = { analyzeDocument };