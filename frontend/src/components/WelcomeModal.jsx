import { useState, useEffect } from 'react';

const DEMO_LINK =
  'https://mega.nz/file/JJ801JqS#tP9H1Qywu7PSLG53VLUl2rly7EmA9_w12-stCQ4c8Ao';

const techStack = [
  { icon: '⚛️', label: 'React + Vite' },
  { icon: '🟢', label: 'Node.js + Express' },
  { icon: '🍃', label: 'MongoDB Atlas' },
  { icon: '✨', label: 'Gemini 2.5 Flash' },
  { icon: '📄', label: 'pdf2json' },
];

export default function WelcomeModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  /* trigger enter animation on mount */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_LINK);
    } catch {
      /* fallback for older browsers */
      const ta = document.createElement('textarea');
      ta.value = DEMO_LINK;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250); /* wait for exit animation */
  };

  /* ────────────────────────────────────────── styles ── */

  const overlay = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--z-modal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 15, 30, 0.65)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    padding: 'var(--space-4)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 300ms var(--ease-out)',
  };

  const modal = {
    position: 'relative',
    width: '100%',
    maxWidth: '560px',
    maxHeight: 'calc(100dvh - var(--space-8))',
    overflowY: 'auto',
    overflow: 'hidden auto',
    background: 'var(--color-bg-base)',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-elevated)',
    border: '1px solid var(--color-border-subtle)',
    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(12px)',
    transition: 'transform 350ms var(--ease-spring), opacity 300ms var(--ease-out)',
    opacity: visible ? 1 : 0,
  };

  const topBanner = {
    background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-accent-500) 100%)',
    padding: 'var(--space-8) var(--space-6) var(--space-6)',
    borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
    color: '#fff',
    textAlign: 'center',
  };

  const topTitle = {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 'var(--font-weight-bold)',
    marginBottom: 'var(--space-1)',
    letterSpacing: 'var(--letter-spacing-tight)',
    lineHeight: 'var(--line-height-tight)',
    color: '#ffffff',
  };

  const topSub = {
    fontSize: 'var(--font-size-sm)',
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: 'var(--font-weight-regular)',
  };

  const body = {
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-5)',
  };

  const sectionTitle = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-1-5)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  };

  const sectionText = {
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-relaxed)',
    color: 'var(--color-text-secondary)',
  };

  const limitPill = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1-5)',
    padding: 'var(--space-1-5) var(--space-3)',
    background: 'var(--color-bg-muted)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
  };

  const limitsRow = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    marginTop: 'var(--space-2)',
  };

  const warningBox = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--color-warning-50)',
    border: '1px solid var(--color-warning-200)',
    borderRadius: 'var(--radius-xl)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-warning-800)',
    lineHeight: 'var(--line-height-relaxed)',
  };

  const linkBox = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-2-5) var(--space-3)',
    background: 'var(--color-bg-muted)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-subtle)',
    marginTop: 'var(--space-2)',
    overflow: 'hidden',
  };

  const linkText = {
    flex: 1,
    fontSize: 'var(--font-size-xs)',
    fontFamily: 'var(--font-family-mono)',
    color: 'var(--color-text-brand)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    userSelect: 'all',
  };

  const copyBtn = {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    padding: 'var(--space-1-5) var(--space-3)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-semibold)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-base)',
    background: copied ? 'var(--color-success-500)' : 'var(--color-primary-600)',
    color: '#fff',
  };

  const techGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    marginTop: 'var(--space-2)',
  };

  const techChip = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1-5)',
    padding: 'var(--space-1-5) var(--space-3)',
    background: 'var(--color-primary-50)',
    border: '1px solid var(--color-primary-200)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-primary-700)',
  };

  const ctaBtn = {
    width: '100%',
    padding: 'var(--space-3-5) var(--space-6)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    borderRadius: 'var(--radius-xl)',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-accent-500) 100%)',
    color: '#fff',
    letterSpacing: 'var(--letter-spacing-wide)',
    transition: 'var(--transition-base)',
    boxShadow: 'var(--shadow-brand-md)',
  };

  const closeBtn = {
    position: 'absolute',
    top: 'var(--space-3)',
    right: 'var(--space-3)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-size-lg)',
    lineHeight: 1,
    transition: 'var(--transition-base)',
  };

  const divider = {
    height: '1px',
    background: 'var(--color-border-subtle)',
    border: 'none',
    margin: 0,
  };

  /* ────────────────────────────────────────── render ── */

  return (
    <div
      style={overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Insurance Analyzer"
      onClick={handleClose}
    >
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* ── gradient banner ── */}
        <div style={topBanner}>
          <button
            style={closeBtn}
            onClick={handleClose}
            aria-label="Close welcome dialog"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            ✕
          </button>
          <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-2)' }}>👋</div>
          <h2 style={topTitle}>Welcome to Insurance Analyzer</h2>
          <p style={topSub}>AI-powered document intelligence — a portfolio demo project</p>
        </div>

        <div style={body}>
          {/* 1 — Disclaimer */}
          <section>
            <h3 style={sectionTitle}>
              <span aria-hidden="true">📋</span> Heads up
            </h3>
            <p style={sectionText}>
              This is a <strong>personal educational project</strong> built purely for
              learning purposes. Any resemblance to real functionality or existing
              entities is entirely coincidental — it&apos;s just a portfolio piece!
            </p>
          </section>

          <hr style={divider} />

          {/* 2 — Usage limits */}
          <section>
            <h3 style={sectionTitle}>
              <span aria-hidden="true">⚙️</span> Usage limits
            </h3>
            <p style={sectionText}>
              Because this is a demo, a few fair-use caps are in place:
            </p>
            <div style={limitsRow}>
              <span style={limitPill}>📊 3 analyses / hour (per IP)</span>
              <span style={limitPill}>💬 10 messages / session</span>
              <span style={limitPill}>🌐 20 analyses / day (global)</span>
            </div>
          </section>

          <hr style={divider} />

          {/* 3 — Privacy warning */}
          <section>
            <div style={warningBox}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }} aria-hidden="true">⚠️</span>
              <span>
                <strong>Please don&apos;t upload real sensitive documents</strong> —
                no contracts, personal data, or confidential files. This is a demo
                environment and not production-grade.
              </span>
            </div>
          </section>

          <hr style={divider} />

          {/* 4 — Demo document */}
          <section>
            <h3 style={sectionTitle}>
              <span aria-hidden="true">📎</span> Demo document
            </h3>
            <p style={sectionText}>
              Want to try it out? Grab this sample insurance PDF:
            </p>
            <div style={linkBox}>
              <span style={linkText}>{DEMO_LINK}</span>
              <button
                style={copyBtn}
                onClick={handleCopy}
                aria-label={copied ? 'Link copied' : 'Copy demo link'}
                onMouseEnter={(e) => {
                  if (!copied) e.currentTarget.style.background = 'var(--color-primary-700)';
                }}
                onMouseLeave={(e) => {
                  if (!copied) e.currentTarget.style.background = 'var(--color-primary-600)';
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </section>

          <hr style={divider} />

          {/* 5 — Tech stack */}
          <section>
            <h3 style={sectionTitle}>
              <span aria-hidden="true">🛠️</span> Built with
            </h3>
            <div style={techGrid}>
              {techStack.map((t) => (
                <span key={t.label} style={techChip}>
                  <span aria-hidden="true">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <button
            style={ctaBtn}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 20px 0 rgba(61,91,240,0.35), 0 0 0 1px rgba(61,91,240,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-brand-md)';
            }}
          >
            Got it, let&apos;s go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
