import { useState, useRef } from 'react';

/* ── File-type icon ───────────────────────────────────────── */
const FileIcon = ({ type }) => {
  const isPdf = type === 'application/pdf';
  return (
    <div className={`fu-file-icon ${isPdf ? 'fu-file-icon--pdf' : 'fu-file-icon--txt'}`} aria-hidden="true">
      {isPdf ? (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="currentColor" fillOpacity="0.12" />
          <path d="M8 6h8l6 6v14H8V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M16 6v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M10 16h4M10 19h6M10 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="currentColor" fillOpacity="0.12" />
          <path d="M8 6h8l6 6v14H8V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M16 6v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M10 14h8M10 17h8M10 20h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      <span className="fu-file-icon__label">{isPdf ? 'PDF' : 'TXT'}</span>
    </div>
  );
};

/* ── Spinner ──────────────────────────────────────────────── */
const Spinner = () => (
  /* A11Y: aria-hidden since parent zone already conveys loading state */
  <div className="fu-spinner animate-spin" aria-hidden="true" />
);

/* ── Main component ───────────────────────────────────────── */
const FileUpload = ({ onUploadComplete, isLoading }) => {
  const [dragState, setDragState] = useState('idle'); // idle | dragover | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef(null);

  const ALLOWED = ['application/pdf', 'text/plain'];

  const processFile = (file) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setUploadError('Only PDF and TXT files are supported.');
      setDragState('error');
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds the 10 MB limit.');
      setDragState('error');
      setSelectedFile(null);
      return;
    }
    setUploadError('');
    setSelectedFile(file);
    setDragState('idle');
    onUploadComplete(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLoading) setDragState('dragover');
  };
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragState('idle');
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragState('idle');
    if (!isLoading) processFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => processFile(e.target.files[0]);
  const handleZoneClick = () => {
    if (!isLoading) inputRef.current?.click();
  };

  /* Resolve CSS modifier */
  const zoneModifier =
    isLoading ? 'fu-zone--uploading'
    : dragState === 'dragover' ? 'fu-zone--dragover'
    : dragState === 'error' ? 'fu-zone--error'
    : selectedFile ? 'fu-zone--success'
    : 'fu-zone--idle';

  return (
    <div className="fu-root">

      {/* A11Y FIX (4.1.3): Live region announces file status changes to
          screen readers — selection, processing, errors */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {isLoading && 'Processing document…'}
        {!isLoading && selectedFile && `File ready: ${selectedFile.name}`}
      </div>

      {/* A11Y FIX (4.1.3): Assertive region for upload errors */}
      {uploadError && (
        <div className="sr-only" aria-live="assertive" role="alert">
          {`Upload failed: ${uploadError}`}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`fu-zone ${zoneModifier}`}
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-label="Upload insurance document — drag and drop or click to browse"
        /* A11Y FIX: aria-busy tells assistive tech the zone is processing */
        aria-busy={isLoading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        /* A11Y FIX (2.1.1): Added Space key — role="button" must respond to
           both Enter AND Space per WAI-ARIA authoring practices */
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); /* prevent page scroll on Space */
            handleZoneClick();
          }
        }}
      >
        {/* Animated pulse ring on dragover */}
        <div className="fu-zone__pulse" aria-hidden="true" />

        {/* Icon area */}
        <div className="fu-zone__icon-wrap" aria-hidden="true">
          {isLoading ? (
            <Spinner />
          ) : selectedFile ? (
            <FileIcon type={selectedFile.type} />
          ) : dragState === 'error' ? (
            <svg className="fu-zone__icon-svg fu-zone__icon-svg--error" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M20 12v10M20 27h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="fu-zone__icon-svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="6" width="24" height="30" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M16 6v8h12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
              <path d="M30 28l4-4-4-4M34 24H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="fu-zone__body">
          {isLoading ? (
            <>
              <p className="fu-zone__title">Processing document…</p>
              <p className="fu-zone__hint fu-zone__filename">
                {selectedFile?.name ?? 'Uploading…'}
              </p>
            </>
          ) : selectedFile ? (
            <>
              <p className="fu-zone__title fu-zone__title--success">File ready</p>
              <p className="fu-zone__hint fu-zone__filename">{selectedFile.name}</p>
            </>
          ) : dragState === 'error' ? (
            <>
              {/* A11Y FIX (4.1.3): role="alert" ensures the visible error
                  is also announced. The sr-only region above handles full
                  announcement; this is for sighted screen-reader users. */}
              <p className="fu-zone__title fu-zone__title--error" role="alert">Upload failed</p>
              <p className="fu-zone__hint fu-zone__hint--error">{uploadError}</p>
            </>
          ) : (
            <>
              <p className="fu-zone__title">
                {dragState === 'dragover' ? 'Drop to upload' : 'Drag & drop your policy document'}
              </p>
              <p className="fu-zone__hint">Supports PDF and TXT · max 10 MB</p>
            </>
          )}
        </div>

        {/* Supported types chips */}
        {!isLoading && !selectedFile && dragState !== 'error' && (
          <div className="fu-type-chips" aria-hidden="true">
            <span className="fu-type-chip fu-type-chip--pdf">PDF</span>
            <span className="fu-type-chip fu-type-chip--txt">TXT</span>
          </div>
        )}

        {/* A11Y FIX (4.1.2): Changed from label[role="presentation"] to a
            proper <span> wrapper. The role="presentation" was stripping
            semantics from the label. The hidden input is triggered by the
            parent zone click already; this button is an additional affordance
            so we stop propagation to prevent double-firing. */}
        {!isLoading && !selectedFile && (
          <span
            className="fu-browse-btn"
            role="button"
            tabIndex={0}
            aria-label="Browse for a file to upload"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                inputRef.current?.click();
              }
            }}
          >
            Browse file
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleChange}
              disabled={isLoading}
              className="fu-hidden-input"
              tabIndex={-1}
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default FileUpload;