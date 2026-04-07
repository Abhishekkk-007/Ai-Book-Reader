import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('folio-theme');
    return stored !== null ? stored === 'dark' : true;
  });

  const [view, setView] = useState('library'); // 'library' | 'reader'
  const [activeBook, setActiveBook] = useState(null);
  const [notification, setNotification] = useState(null);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('folio-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const openBook = useCallback((book) => {
    setActiveBook(book);
    setView('reader');
  }, []);

  const closeBook = useCallback(() => {
    setView('library');
    setActiveBook(null);
  }, []);

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), duration);
  }, []);

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, view, activeBook, openBook, closeBook, notification, notify }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}