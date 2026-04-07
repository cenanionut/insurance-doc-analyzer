const PDFParser = require('pdf2json');

const extractTextFromPDF = (buffer) => {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(null, 1);

        parser.on('pdfParser_dataReady', () => {
            const text = parser.getRawTextContent();
            resolve(text);
        });

        parser.on('pdfParser_dataError', (err) => {
            reject(new Error(err.parserError));
        });

        parser.parseBuffer(buffer);
    });
};

const extractText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';

        if (req.file.mimetype === 'application/pdf') {
            text = await extractTextFromPDF(req.file.buffer);
        } else {
            text = req.file.buffer.toString('utf-8');
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from file' });
        }

        return res.json({
            fileName: req.file.originalname,
            characterCount: text.length,
            preview: text.substring(0, 300),
            text
        });

    } catch (error) {
        console.error('Extract text error:', error.message);
        return res.status(500).json({ error: 'Failed to process file' });
    }
};

module.exports = { extractText };