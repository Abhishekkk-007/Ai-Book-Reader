import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('bookmarks'); // 'bookmarks'|'highlights'|'summary'

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // [{page, text, index}]
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeSearchResult, setActiveSearchResult] = useState(0);

  // Highlight toolbar
  const [highlightSelection, setHighlightSelection] = useState(null); // {text, x, y}

  // TTS state
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsPaused, setTtsPaused] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [ttsSentenceIndex, setTtsSentenceIndex] = useState(-1);
  const [ttsPanelOpen, setTtsPanelOpen] = useState(false);

  // Page text cache for TTS + Summary
  const pageTextsRef = useRef({});

  const goToPage = useCallback((page) => {
    setCurrentPage((prev) => {
      const next = Math.max(1, Math.min(page, 9999));
      return next;
    });
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.15, 3.0)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.15, 0.5)), []);
  const resetZoom = useCallback(() => setZoom(1.0), []);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  return (
    <ReaderContext.Provider value={{
      numPages, setNumPages,
      currentPage, setCurrentPage, goToPage,
      zoom, setZoom, zoomIn, zoomOut, resetZoom,
      sidebarOpen, setSidebarOpen, toggleSidebar,
      sidebarTab, setSidebarTab,
      searchQuery, setSearchQuery,
      searchResults, setSearchResults,
      searchVisible, setSearchVisible,
      activeSearchResult, setActiveSearchResult,
      highlightSelection, setHighlightSelection,
      ttsActive, setTtsActive,
      ttsPaused, setTtsPaused,
      ttsSpeed, setTtsSpeed,
      ttsSentenceIndex, setTtsSentenceIndex,
      ttsPanelOpen, setTtsPanelOpen,
      pageTextsRef,
    }}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used inside ReaderProvider');
  return ctx;
}