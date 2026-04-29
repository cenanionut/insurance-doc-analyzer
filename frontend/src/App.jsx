import { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { uploadDocument, analyzeDocument } from './services/api';
import ChatBox from './components/ChatBox';
import './App.css';

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
    setConversationId(null);

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
        setError('Gemini AI is currently experiencing high demand. Please wait 30 seconds and try again.');
      } else if (status === 429) {
        setError('API rate limit reached. Please wait a minute before trying again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = analysis || conversationId;

  return (
    <div className="app-root">

      {/* A11Y FIX (2.4.1): Skip link for keyboard users to bypass header */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── STICKY HEADER ─────────────────────────────── */}
      <header className="app-header" role="banner">
        <div className="app-header__inner">

          {/* Logo + name */}
          <div className="app-header__brand">
            <div className="app-header__logo" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="7" fill="url(#logoGrad)" />
                <path d="M7 10.5C7 9.12 8.12 8 9.5 8h9C19.88 8 21 9.12 21 10.5v1C21 12.88 19.88 14 18.5 14h-9C8.12 14 7 12.88 7 11.5v-1z" fill="white" fillOpacity="0.9"/>
                <path d="M7 17.5C7 16.12 8.12 15 9.5 15H14c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H9.5C8.12 20 7 18.88 7 17.5z" fill="white" fillOpacity="0.55"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2a3de6"/>
                    <stop offset="1" stopColor="#6441ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="app-header__title-group">
              <h1 className="app-header__app-name">Insurance Analyzer</h1>
              <span className="app-header__tagline">AI-powered document intelligence</span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="app-header__status" aria-label="System status">
            <span
              className={`app-header__status-dot ${isLoading ? 'app-header__status-dot--busy' : 'app-header__status-dot--ready'}`}
              aria-hidden="true"
            />
            <span className="app-header__status-label">
              {isLoading ? 'Analyzing…' : 'Gemini Ready'}
            </span>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <main className={`app-main ${hasResults ? 'app-main--two-col' : 'app-main--single'}`} id="main-content">

        {/* ── LEFT COLUMN: upload + analysis ── */}
        <section className="app-col app-col--left" aria-label="Document upload and analysis">

          {/* Upload card */}
          <div className="app-card animate-fade-up">
            <div className="app-card__header">
              <span className="app-card__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 12.5v1.25A1.25 1.25 0 0 0 4.25 15h9.5A1.25 1.25 0 0 0 15 13.75V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 3v7.5M6 5.5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <h2 className="app-card__title">Upload Document</h2>
            </div>
            <FileUpload onUploadComplete={handleUpload} isLoading={isLoading} />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="app-loading animate-fade-in" role="status" aria-live="polite">
              <div className="app-loading__spinner animate-spin" aria-hidden="true" />
              <p className="app-loading__text">Analyzing document with Gemini AI…</p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="app-error animate-fade-up" role="alert" aria-live="assertive">
              <span className="app-error__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <div>
                <p className="app-error__title">Something went wrong</p>
                <p className="app-error__body">{error}</p>
              </div>
            </div>
          )}

          {/* A11Y FIX (4.1.3): aria-live region so new analysis results
              are announced to screen readers when they appear */}
          <div aria-live="polite">
          {analysis && (
            <div className="app-card app-card--results animate-fade-up" aria-label="Analysis results">
              <div className="app-card__header">
                <span className="app-card__icon app-card__icon--success" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <h2 className="app-card__title">Analysis Results</h2>
                  {fileName && (
                    <p className="app-card__subtitle">{fileName}</p>
                  )}
                </div>
              </div>
              <AnalysisResult analysis={analysis} />
            </div>
          )}
          </div>
        </section>

        {/* ── RIGHT COLUMN: chat ── */}
        {conversationId && (
          <section className="app-col app-col--right animate-slide-right" aria-label="Document chat">
            <div className="app-card app-card--chat app-card--sticky-chat">
              <div className="app-card__header">
                <span className="app-card__icon app-card__icon--chat" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v6A1.5 1.5 0 0 1 13.5 12H9l-3 3v-3H4.5A1.5 1.5 0 0 1 3 10.5v-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <h2 className="app-card__title">Ask the Document</h2>
                  <p className="app-card__subtitle">Chat with your policy using AI</p>
                </div>
              </div>
              <ChatBox conversationId={conversationId} />
            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="app-footer" role="contentinfo">
        <div className="app-footer__inner">
          <span className="app-footer__brand">Insurance Analyzer</span>
          <span className="app-footer__sep" aria-hidden="true">·</span>
          <span className="app-footer__copy">Powered by Gemini AI</span>
          <span className="app-footer__sep" aria-hidden="true">·</span>
          <span className="app-footer__copy">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>

    </div>
  );
}

export default App;