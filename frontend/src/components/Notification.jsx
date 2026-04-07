import React from 'react';
import { useApp } from '../context/AppContext';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function Notification() {
  const { notification } = useApp();
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up pointer-events-none">
      <div className="card px-4 py-3 flex items-center gap-3 shadow-2xl min-w-[200px] max-w-[320px]"
        style={{ borderColor: 'var(--accent)', borderLeftWidth: '3px' }}>
        <span className="text-base shrink-0">{ICONS[notification.type] || 'ℹ️'}</span>
        <span className="text-sm text-[var(--text-primary)] font-medium">{notification.message}</span>
      </div>
    </div>
  );
}