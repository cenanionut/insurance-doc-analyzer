import { useState } from 'react';

const FileUpload = ({ onUploadComplete, isLoading }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleFile = (file) => {
        if (!file) return;
        const allowed = ['application/pdf', 'text/plain'];
        if (!allowed.includes(file.type)) {
            alert('Only PDF and TXT files are supported.');
            return;
        }
        onUploadComplete(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        handleFile(e.target.files[0]);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${dragOver ? '#2c6fad' : '#cccccc'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                background: dragOver ? '#f0f7ff' : '#fafafa',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
            }}
        >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a3a5c', marginBottom: '8px' }}>
                Drag & drop your insurance document here
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                Supports PDF and TXT — max 10MB
            </p>
            <label style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: isLoading ? '#ccc' : '#2c6fad',
                color: 'white',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
            }}>
                {isLoading ? 'Processing...' : 'Browse File'}
                <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ display: 'none' }}
                />
            </label>
        </div>
    );
};

export default FileUpload;