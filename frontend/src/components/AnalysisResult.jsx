import { useState, useEffect } from 'react';

/* ── Complexity gauge (SVG arc) ───────────────────────────── */
const ComplexityGauge = ({ score }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 60);
    return () => clearTimeout(t);
  }, [score]);

  const MAX = 10, R = 42, cx = 56, cy = 56;
  const circumference = Math.PI * R;
  const progress = (animated / MAX) * circumference;
  const color = score <= 3 ? 'var(--color-success-500)' : score <= 6 ? 'var(--color-warning-500)' : 'var(--color-error-500)';
  const label = score <= 3 ? 'Low' : score <= 6 ? 'Moderate' : 'High';

  return (
    /* A11Y FIX (4.1.2): Added role="img" so aria-label is valid on div */
    <div className="ar-gauge" role="img" aria-label={`Complexity score ${score} out of 10 — ${label}`}>
      <svg width="112" height="68" viewBox="0 0 112 68" className="ar-gauge__svg" aria-hidden="true">
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="var(--color-neutral-200)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${progress} ${circumference}`} style={{ transition: 'stroke-dasharray 0.8s var(--ease-out), stroke 0.4s var(--ease-out)' }} />
        <circle cx={cx} cy={cy - 4} r="4" fill={color} style={{ transition: 'fill 0.4s var(--ease-out)' }} />
      </svg>
      <div className="ar-gauge__labels" aria-hidden="true">
        <span className="ar-gauge__score" style={{ color }}>{score}</span>
        <span className="ar-gauge__max">/10</span>
      </div>
      <span className="ar-gauge__level" aria-hidden="true" style={{ color }}>{label}</span>
    </div>
  );
};

/* ── Product type badge ───────────────────────────────────── */
const ProductBadge = ({ type }) => {
  const typeMap = {
    'Life': { icon: '❤️', mod: 'badge--life' },
    'Health': { icon: '🏥', mod: 'badge--health' },
    'Auto': { icon: '🚗', mod: 'badge--auto' },
    'Home': { icon: '🏠', mod: 'badge--home' },
    'Travel': { icon: '✈️', mod: 'badge--travel' },
    'Business': { icon: '💼', mod: 'badge--business' },
  };
  const key = Object.keys(typeMap).find(k => type?.toLowerCase().includes(k.toLowerCase())) ?? null;
  const meta = key ? typeMap[key] : { icon: '📋', mod: 'badge--default' };
  return (
    <div className={`ar-product-badge ${meta.mod}`} role="img" aria-label={`Product type: ${type}`}>
      <span className="ar-product-badge__icon" aria-hidden="true">{meta.icon}</span>
      <span className="ar-product-badge__label">{type}</span>
    </div>
  );
};

/* ── Expandable clause card ───────────────────────────────── */
const ClauseCard = ({ clause, index }) => {
  const [open, setOpen] = useState(false);
  const id = `clause-${index}`;
  const colonIdx = clause.indexOf(':');
  const hasTitle = colonIdx > 0 && colonIdx < 60;
  const title = hasTitle ? clause.slice(0, colonIdx).trim() : `Clause ${index + 1}`;
  const body = hasTitle ? clause.slice(colonIdx + 1).trim() : clause;

  return (
    <div className={`ar-clause ${open ? 'ar-clause--open' : ''}`}>
      <button className="ar-clause__header" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={id} id={`${id}-btn`}>
        <span className="ar-clause__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="ar-clause__title">{title}</span>
        <svg className="ar-clause__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="ar-clause__body" id={id} role="region" aria-labelledby={`${id}-btn`} hidden={!open}>
        <p className="ar-clause__text">{body}</p>
      </div>
    </div>
  );
};

/* ── Main component ───────────────────────────────────────── */
const AnalysisResult = ({ analysis }) => {
  const { summary, productType, keyClauses = [], complexityScore } = analysis;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    /* A11Y FIX (4.1.2): <section> instead of <div> for valid aria-label.
       A11Y FIX (4.1.3): aria-live="polite" announces results when they appear. */
    <section className={`ar-root ${mounted ? 'ar-root--visible' : ''}`} aria-label="Analysis results" aria-live="polite">
      {/* ── Row 1: Product badge + Gauge ── */}
      <div className="ar-top-row">
        <div className="ar-meta-block">
          <span className="ar-section-label" id="ar-product-label">Product Type</span>
          <ProductBadge type={productType} />
        </div>
        <div className="ar-meta-block ar-meta-block--gauge">
          <span className="ar-section-label" id="ar-complexity-label">Complexity</span>
          <ComplexityGauge score={complexityScore} />
        </div>
      </div>

      {/* A11Y FIX (4.1.2): <section> for valid aria-label */}
      <section className="ar-summary-block" aria-label="Document summary">
        <div className="ar-summary-block__bar" aria-hidden="true" />
        <div className="ar-summary-block__content">
          <span className="ar-section-label">Summary</span>
          <blockquote className="ar-summary-quote">{summary}</blockquote>
        </div>
      </section>

      {/* A11Y FIX (4.1.2): <section> for valid aria-label */}
      <section className="ar-clauses-block" aria-label="Key clauses">
        <span className="ar-section-label">
          Key Clauses
          <span className="ar-clauses-count" aria-label={`${keyClauses.length} clauses`}>{keyClauses.length}</span>
        </span>
        <div className="ar-clauses-list" role="list">
          {keyClauses.map((clause, i) => (
            <div key={`clause-${i}-${clause.slice(0, 30)}`} role="listitem"><ClauseCard clause={clause} index={i} /></div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AnalysisResult;