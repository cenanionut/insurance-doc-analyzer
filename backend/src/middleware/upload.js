const multer = require('multer');

const storage = multer.memoryStorage(); // stocam in RAM, nu pe disc

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'application/pdf' || file.mimetype == 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and TXT files are allowed'), false);
        }
    }
});

module.exports = upload;