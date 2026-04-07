import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useBookmarks(bookId) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!bookId) return;
    api.get(`/bookmarks/${bookId}`)
      .then(({ data }) => setBookmarks(data.bookmarks || []))
      .catch(() => {});
  }, [bookId]);

  const addBookmark = useCallback(async (page, label = '') => {
    // Prevent duplicate page bookmarks
    if (bookmarks.find((b) => b.page === page)) return null;
    try {
      const { data } = await api.post('/bookmarks', { bookId, page, label });
      setBookmarks((prev) => [...prev, data.bookmark].sort((a, b) => a.page - b.page));
      return data.bookmark;
    } catch (err) {
      console.error(err);
    }
  }, [bookId, bookmarks]);

  const removeBookmark = useCallback(async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const isBookmarked = useCallback((page) => bookmarks.some((b) => b.page === page), [bookmarks]);
  const getBookmarkId = useCallback((page) => bookmarks.find((b) => b.page === page)?._id, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarkId };
}