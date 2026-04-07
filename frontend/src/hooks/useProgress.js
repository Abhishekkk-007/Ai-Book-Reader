import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

export function useProgress(bookId) {
  const [progress, setProgress] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!bookId) return;
    api.get(`/progress/${bookId}`)
      .then(({ data }) => { if (data.progress) setProgress(data.progress); })
      .catch(() => {});
  }, [bookId]);

  const saveProgress = useCallback((updates) => {
    if (!bookId) return;
    setProgress((prev) => ({ ...prev, ...updates }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await api.put(`/progress/${bookId}`, updates);
      } catch (err) {
        console.error('Progress save failed:', err);
      }
    }, 1500);
  }, [bookId]);

  return { progress, saveProgress };
}