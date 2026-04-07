import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/books');
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const uploadBook = useCallback(async (file, title, author) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('pdf', file);
      if (title) form.append('title', title);
      if (author) form.append('author', author);
      const { data } = await api.post('/books/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBooks((prev) => [data.book, ...prev]);
      return data.book;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const updateBook = useCallback(async (id, updates) => {
    try {
      const { data } = await api.patch(`/books/${id}`, updates);
      setBooks((prev) => prev.map((b) => (b._id === id ? data.book : b)));
      return data.book;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteBook = useCallback(async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { books, loading, uploading, error, fetchBooks, uploadBook, updateBook, deleteBook };
}