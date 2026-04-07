import React from 'react';
import { useReader } from '../../context/ReaderContext';
import { useTTS } from '../../hooks/useTTS';

export default function TTSPanel({ pageText }) {
  const {
    ttsActive, ttsPaused, ttsSpeed, setTtsSpeed,
    ttsSentenceIndex, setTtsPanelOpen,
  } = useReader();
  const { play, pause, resume, stop } = useTTS();

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const handlePlay = () => {
    if (!pageText?.trim()) return;
    if (ttsActive && !ttsPaused) {
      pause();
    } else if (ttsActive && ttsPaused) {
      resume();
    } else {
      play(pageText);
    }
  };

  const getPlayIcon = () => {
    if (ttsActive && !ttsPaused) return '⏸';
    return '▶';
  };

  const getStatusText = () => {
    if (!ttsActive) return 'Ready to read';
    if (ttsPaused) return 'Paused';
    return `Reading sentence ${ttsSentenceIndex + 1}…`;
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--bg-card)] p-3 animate-slide-up shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${ttsActive ? 'animate-pulse-soft text-ember-400' : 'text-[var(--text-muted)]'}`}>
            🔊
          </span>
          <div>
            <p className="text-xs font-medium text-[var(--text-primary)]">Read Aloud</p>
            <p className="text-[10px] text-[var(--text-muted)]">{getStatusText()}</p>
          </div>
        </div>
        <button
          onClick={() => { stop(); setTtsPanelOpen(false); }}
          className="btn-ghost w-6 h-6 flex items-center justify-center text-xs"
        >
          ×
        </button>
      </div>

      {/* Voice legend */}
      <div className="flex gap-3 mb-2 text-[10px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-azure-400 inline-block" /> Narrator</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ember-400 inline-block" /> Dialogue</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Stop */}
        {ttsActive && (
          <button onClick={stop} className="btn-ghost w-8 h-8 flex items-center justify-center text-sm" title="Stop">
            ⏹
          </button>
        )}

        {/* Play / Pause */}
        <button
          onClick={handlePlay}
          disabled={!pageText?.trim()}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <span>{getPlayIcon()}</span>
          <span className="text-xs">{ttsActive && !ttsPaused ? 'Pause' : ttsActive ? 'Resume' : 'Read Page'}</span>
        </button>

        {/* Speed selector */}
        <select
          value={ttsSpeed}
          onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
          className="input-base !w-auto !py-1 text-xs"
          title="Playback speed"
        >
          {speeds.map((s) => (
            <option key={s} value={s}>{s}×</option>
          ))}
        </select>
      </div>
    </div>
  );
}