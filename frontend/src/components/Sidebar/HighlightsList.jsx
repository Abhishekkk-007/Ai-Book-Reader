import React, { useState } from 'react';
import { truncate } from '../../utils/textUtils';
import { useReader } from '../../context/ReaderContext';

export default function HighlightsList({ highlights, onRemove, onUpdate, onJump }) {
  const { currentPage } = useReader();
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const startEdit = (h) => {
    setEditingId(h._id);
    setNoteText(h.note || '');
  };

  const saveNote = (id) => {
    onUpdate(id, { note: noteText });
    setEditingId(null);
  };

  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-4">
        <span className="text-3xl">✏️</span>
        <p className="text-xs text-[var(--text-muted)]">No highlights yet. Select text while reading to highlight it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {highlights.map((h) => (
        <div
          key={h._id}
          className={`card p-2.5 cursor-pointer group transition-all
            ${h.page === currentPage ? 'border-ember-500/40' : 'hover:border-[var(--text-muted)]/40'}`}
          onClick={() => onJump(h.page)}
        >
          {/* Color + page */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: h.color }}
              />
              <span className="text-[10px] text-[var(--text-muted)] font-mono">p.{h.page}</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); startEdit(h); }}
                className="w-5 h-5 flex items-center justify-center text-[10px] btn-ghost"
                title="Edit note"
              >✏️</button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(h._id); }}
                className="w-5 h-5 flex items-center justify-center text-[10px] btn-ghost hover:text-red-400"
                title="Delete"
              >×</button>
            </div>
          </div>

          {/* Highlighted text */}
          <p
            className="text-xs text-[var(--text-primary)] leading-relaxed rounded px-1 py-0.5"
            style={{ backgroundColor: h.color + '30', borderLeft: `2px solid ${h.color}` }}
          >
            {truncate(h.text, 120)}
          </p>

          {/* Note */}
          {editingId === h._id ? (
            <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="input-base text-xs !py-1 resize-none h-14 w-full"
                placeholder="Add a note…"
              />
              <div className="flex gap-1 mt-1">
                <button onClick={() => saveNote(h._id)} className="btn-primary text-[10px] !px-2 !py-1">Save</button>
                <button onClick={() => setEditingId(null)} className="btn-ghost text-[10px] !px-2 !py-1">Cancel</button>
              </div>
            </div>
          ) : h.note ? (
            <p className="mt-1.5 text-[10px] text-[var(--text-muted)] italic border-l border-[var(--border)] pl-2">
              {h.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}