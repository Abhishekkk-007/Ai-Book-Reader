import React, { useState, useRef, useCallback } from 'react';

export default function UploadModal({ onUpload, onClose, uploading }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.pdf$/i, ''));
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }, [title]);

  const handleSubmit = () => {
    if (!file) return;
    onUpload(file, title, author);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Add Book to Library
          </h2>
          <button onClick={onClose} className="btn-ghost w-8 h-8 flex items-center justify-center text-lg">
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${dragOver ? 'border-ember-400 bg-ember-500/10' : 'border-[var(--border)] hover:border-ember-400/60'}
              ${file ? 'bg-emerald-500/10 border-emerald-500/60' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div>
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-emerald-400 font-medium">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">📄</div>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  Drop your PDF here
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Book Title
            </label>
            <input
              className="input-base"
              placeholder="Enter book title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Author
            </label>
            <input
              className="input-base"
              placeholder="Author name…"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-[var(--border)]">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <span className="spinner !w-4 !h-4 !border-2" />
                Uploading…
              </>
            ) : 'Add to Library'}
          </button>
        </div>
      </div>
    </div>
  );
}