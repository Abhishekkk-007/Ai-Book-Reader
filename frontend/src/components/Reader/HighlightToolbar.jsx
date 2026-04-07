import React, { useState } from 'react';

const COLORS = [
  { name: 'amber', hex: '#fbbf24', bg: 'bg-amber-400' },
  { name: 'emerald', hex: '#34d399', bg: 'bg-emerald-400' },
  { name: 'sky', hex: '#38bdf8', bg: 'bg-sky-400' },
  { name: 'rose', hex: '#fb7185', bg: 'bg-rose-400' },
  { name: 'violet', hex: '#a78bfa', bg: 'bg-violet-400' },
];

export default function HighlightToolbar({ x, y, text, onHighlight, onClose }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const save = () => {
    onHighlight({ text, color: selectedColor.hex, note });
    onClose();
  };

  return (
    <div
      className="fixed z-50 card shadow-2xl p-2 animate-slide-up"
      style={{ left: Math.min(x, window.innerWidth - 240), top: y - 8, transform: 'translateY(-100%)' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1 mb-1">
        {/* Color swatches */}
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c)}
            className={`w-5 h-5 rounded-full transition-transform ${c.bg}
              ${selectedColor.name === c.name ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
          />
        ))}
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        {/* Note toggle */}
        <button
          onClick={() => setShowNote((v) => !v)}
          className={`btn-ghost w-6 h-6 flex items-center justify-center text-xs
            ${showNote ? 'text-ember-400' : ''}`}
          title="Add note"
        >
          ✏️
        </button>
        {/* Highlight */}
        <button onClick={save} className="btn-primary !px-2 !py-1 text-xs">
          Highlight
        </button>
        {/* Close */}
        <button onClick={onClose} className="btn-ghost w-6 h-6 flex items-center justify-center text-xs ml-1">
          ×
        </button>
      </div>

      {showNote && (
        <div className="mt-1">
          <textarea
            autoFocus
            className="input-base text-xs !py-1 resize-none h-16 w-48"
            placeholder="Add a note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}