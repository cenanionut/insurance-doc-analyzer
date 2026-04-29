import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

/* ── Constants ────────────────────────────────────────────── */
const MAX_CHARS = 500;

/* ── Timestamp helper ─────────────────────────────────────── */
const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ── Avatar ───────────────────────────────────────────────── */
const Avatar = ({ role }) => (
  <div className={`cb-avatar cb-avatar--${role}`} aria-hidden="true">
    {role === 'user' ? 'U' : 'AI'}
  </div>
);

/* ── Typing indicator ─────────────────────────────────────── */
const TypingIndicator = () => (
  /* A11Y: aria-live + role="status" announces typing to screen readers */
  <div className="cb-message cb-message--assistant cb-message--typing" role="status" aria-live="polite" aria-label="AI is typing">
    <Avatar role="assistant" />
    <div className="cb-bubble cb-bubble--assistant">
      <span className="cb-typing" aria-hidden="true">
        <span className="cb-typing__dot" style={{ animationDelay: '0ms' }} />
        <span className="cb-typing__dot" style={{ animationDelay: '160ms' }} />
        <span className="cb-typing__dot" style={{ animationDelay: '320ms' }} />
      </span>
    </div>
  </div>
);

/* ── Empty state ──────────────────────────────────────────── */
const EmptyState = () => (
  /* A11Y FIX (4.1.2): Added role="status" so aria-label is valid on div */
  <div className="cb-empty" role="status" aria-label="No messages yet">
    <div className="cb-empty__illustration" aria-hidden="true">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="var(--color-accent-50)" />
        <rect x="16" y="22" width="32" height="14" rx="7" fill="var(--color-primary-200)" />
        <rect x="22" y="42" width="26" height="12" rx="6" fill="var(--color-accent-200)" />
        <circle cx="54" cy="20" r="3" fill="var(--color-accent-400)" />
        <circle cx="14" cy="46" r="2" fill="var(--color-primary-400)" />
        <circle cx="58" cy="50" r="2" fill="var(--color-warning-400)" />
      </svg>
    </div>
    <p className="cb-empty__title">Ask anything about the document</p>
    <p className="cb-empty__hint">
      Coverage details, exclusions, premium calculations, claim processes — just ask.
    </p>
  </div>
);

/* ── Chat bubble ──────────────────────────────────────────── */
const ChatMessage = ({ msg }) => (
  <div className={`cb-message cb-message--${msg.role}`}>
    {msg.role === 'assistant' && <Avatar role="assistant" />}
    <div className="cb-bubble-wrap">
      <div className={`cb-bubble cb-bubble--${msg.role}`}>
        <p className="cb-bubble__text">{msg.content}</p>
      </div>
      <time className="cb-timestamp" dateTime={msg.timestamp.toISOString()}>
        {formatTime(msg.timestamp)}
      </time>
    </div>
    {msg.role === 'user' && <Avatar role="user" />}
  </div>
);

/* ── Send icon ────────────────────────────────────────────── */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 9l12-6-6 12V9H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ── Main component ───────────────────────────────────────── */
const ChatBox = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* Auto-resize textarea */
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', content: question, timestamp: new Date() },
    ]);
    setIsLoading(true);

    try {
      const { answer } = await sendChatMessage(conversationId, question);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: answer, timestamp: new Date() },
      ]);
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.error;

      let errorText = '❌ Failed to get a response. Please try again.';
      if (status === 429) {
        errorText = `⚠️ ${serverMessage || 'Message limit reached for this session.'}`;
      } else if (status === 503) {
        errorText = '⚠️ Gemini AI is experiencing high demand. Please wait and retry.';
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorText, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    /* A11Y FIX (2.1.1): Escape blurs textarea so keyboard users can
       easily exit the chat input and continue tabbing */
    if (e.key === 'Escape') {
      textareaRef.current?.blur();
    }
  };

  const charsLeft = MAX_CHARS - input.length;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft >= 0 && charsLeft <= 50;
  const canSend = input.trim().length > 0 && !isLoading && !isOverLimit;

  return (
    /* A11Y FIX (4.1.2): <section> instead of <div> for valid aria-label */
    <section className="cb-root" aria-label="Document chat">

      {/* ── Messages list ── */}
      <div
        className="cb-messages"
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {messages.length === 0 && !isLoading && <EmptyState />}

        {messages.map((msg, i) => (
          <ChatMessage key={`${msg.role}-${msg.timestamp.getTime()}-${i}`} msg={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div className="cb-input-area">
        <div className={`cb-input-wrap ${isLoading ? 'cb-input-wrap--disabled' : ''} ${isOverLimit ? 'cb-input-wrap--overlimit' : ''}`}>
          <textarea
            ref={textareaRef}
            className="cb-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the document… (Enter to send)"
            disabled={isLoading}
            rows={1}
            maxLength={MAX_CHARS + 20}
            aria-label="Chat input"
            aria-describedby="cb-char-counter"
          />

          <div className="cb-input-footer">
            <span
              id="cb-char-counter"
              className={`cb-char-counter ${isNearLimit ? 'cb-char-counter--warn' : ''} ${isOverLimit ? 'cb-char-counter--over' : ''}`}
              aria-live="polite"
              aria-label={`${charsLeft} characters remaining`}
            >
              {charsLeft}
            </span>

            <button
              className={`cb-send-btn ${canSend ? 'cb-send-btn--active' : ''}`}
              onClick={handleSend}
              disabled={!canSend}
              aria-label={isLoading ? 'Sending message…' : 'Send message'}
              id="cb-send-button"
            >
              {isLoading ? (
                <span className="cb-send-spinner animate-spin" aria-hidden="true" />
              ) : (
                <SendIcon />
              )}
              <span className="cb-send-btn__label">{isLoading ? 'Sending' : 'Send'}</span>
            </button>
          </div>
        </div>
        {/* A11Y FIX (1.4.3): hint uses --color-text-muted for ≥4.5:1 contrast */}
        <p className="cb-input-hint">Shift+Enter for new line</p>
      </div>

    </section>
  );
};

export default ChatBox;