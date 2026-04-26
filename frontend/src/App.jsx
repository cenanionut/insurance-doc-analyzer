import { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { uploadDocument, analyzeDocument } from './services/api';
import ChatBox from './components/ChatBox';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { text, fileName: name } = await uploadDocument(file);
      setFileName(name);
      const result = await analyzeDocument(text, name);
      setAnalysis(result.analysis);
      setConversationId(result.conversationId);
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      const status = err.response?.status;

      if (status === 503) {
        setError('⚠️ Gemini AI is currently experiencing high demand. Please wait 30 seconds and try again.');
      } else if (status === 429) {
        setError('⚠️ API rate limit reached. Please wait a minute before trying again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f4f8',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ background: '#1a3a5c', padding: '16px 32px', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
          🛡️ Insurance Document Analyzer
        </h1>
        <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.7 }}>
          AI-powered document analysis — Powered by Gemini
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '32px auto', padding: '0 16px' }}>

        {/* Upload Card */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '24px', marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1a3a5c' }}>
            Upload Document
          </h2>
          <FileUpload onUploadComplete={handleUpload} isLoading={isLoading} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#2c6fad', fontSize: '15px' }}>
            ⏳ Analyzing document with AI...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffcccc',
            borderRadius: '8px', padding: '16px', color: '#c0392b', marginBottom: '16px'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '24px', marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1a3a5c' }}>
              📊 Analysis — {fileName}
            </h2>
            <AnalysisResult analysis={analysis} />
          </div>
        )}

        {conversationId && (
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1a3a5c' }}>
              💬 Ask Questions About the Document
            </h2>
            <ChatBox conversationId={conversationId} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;