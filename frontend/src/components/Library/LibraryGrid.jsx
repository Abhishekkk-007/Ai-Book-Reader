import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import UploadModal from './UploadModal';
import { useBooks } from '../../hooks/useBooks';
import { useApp } from '../../context/AppContext';
import api from '../../utils/api';

export default function LibraryGrid() {
  const { books, loading, uploading, uploadBook, deleteBook } = useBooks();
  const { openBook, toggleTheme, isDark, notify } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [search, setSearch] = useState('');

  // Load progress for all books
  useEffect(() => {
    if (!books.length) return;
    const fetchAll = async () => {
      const entries = await Promise.all(
        books.map(async (b) => {
          try {
            const { data } = await api.get(`/progress/${b._id}`);
            return [b._id, data.progress];
          } catch {
            return [b._id, null];
          }
        })
      );
      setProgressMap(Object.fromEntries(entries));
    };
    fetchAll();
  }, [books]);

  const handleUpload = async (file, title, author) => {
    try {
      await uploadBook(file, title, author);
      setShowUpload(false);
      notify('Book added to library! 📚', 'success');
    } catch {
      notify('Upload failed. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this book from your library?')) return;
    await deleteBook(id);
    notify('Book removed.', 'info');
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📖</span>
          <div>
            <h1 className="font-serif text-xl font-bold text-[var(--text-primary)] leading-none">
              Folio
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 tracking-widest uppercase">
              Your Reading Sanctuary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
            <input
              className="input-base pl-9 w-56"
              placeholder="Search library…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost w-9 h-9 flex items-center justify-center text-base"
            title="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Upload */}
          <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
            <span>+</span>
            <span className="hidden sm:inline">Add Book</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="spinner" />
            <p className="text-sm text-[var(--text-muted)]">Loading your library…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <div className="text-6xl">📚</div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)] mb-1">
                {search ? 'No books found' : 'Your library is empty'}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {search ? 'Try a different search.' : 'Add your first PDF book to get started.'}
              </p>
            </div>
            {!search && (
              <button onClick={() => setShowUpload(true)} className="btn-primary mt-2">
                Add Your First Book
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-[var(--text-muted)]">
                {filtered.length} book{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  progress={progressMap[book._id]}
                  onOpen={openBook}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showUpload && (
        <UploadModal
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
          uploading={uploading}
        />
      )}
    </div>
  );
}