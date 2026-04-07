import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useHighlights(bookId) {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    if (!bookId) return;
    api.get(`/highlights/${bookId}`)
      .then(({ data }) => setHighlights(data.highlights || []))
      .catch(() => {});
  }, [bookId]);

  const addHighlight = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/highlights', { bookId, ...payload });
      setHighlights((prev) => [...prev, data.highlight]);
      return data.highlight;
    } catch (err) {
      console.error(err);
    }
  }, [bookId]);

  const updateHighlight = useCallback(async (id, updates) => {
    try {
      const { data } = await api.patch(`/highlights/${id}`, updates);
      setHighlights((prev) => prev.map((h) => (h._id === id ? data.highlight : h)));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const removeHighlight = useCallback(async (id) => {
    try {
      await api.delete(`/highlights/${id}`);
      setHighlights((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { highlights, addHighlight, updateHighlight, removeHighlight };
}