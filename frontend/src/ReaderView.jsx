import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useReader } from './context/ReaderContext';
import { useProgress } from './hooks/useProgress';
import { useHighlights } from './hooks/useHighlights';
import { useBookmarks } from './hooks/useBookmarks';
import TopBar from './components/Controls/TopBar';
import SearchOverlay from './components/Reader/SearchOverlay';
import PDFReader from './components/Reader/PDFReader';
import Sidebar from './components/Sidebar/Sidebar';
import TTSPanel from './components/TTS/TTSPanel';
import Notification from './components/Notification';

export default function ReaderView() {
  const { activeBook, notify } = useApp();

  const {
    currentPage,
    numPages,
    zoom,
    searchVisible,
    searchQuery,
    searchResults,
    activeSearchResult,
    ttsPanelOpen,
    pageTextsRef,
    goToPage,
  } = useReader();

  const { progress, saveProgress } = useProgress(activeBook?._id);
  const { highlights, addHighlight, updateHighlight, removeHighlight } = useHighlights(activeBook?._id);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarkId } = useBookmarks(activeBook?._id);

  // Restore last reading position once progress loads
  useEffect(() => {
    if (progress?.currentPage && progress.currentPage > 1) {
      goToPage(progress.currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress?._id]);

  // Auto-save progress whenever page or zoom changes
  useEffect(() => {
    if (!numPages || !activeBook?._id) return;
    saveProgress({
      currentPage,
      totalPages: numPages,
      percentage: Math.round((currentPage / numPages) * 100),
      zoom,
    });
  }, [currentPage, numPages, zoom]);

  const handleBookmark = async () => {
    if (isBookmarked(currentPage)) {
      const id = getBookmarkId(currentPage);
      await removeBookmark(id);
      notify('Bookmark removed', 'info');
    } else {
      await addBookmark(currentPage, `Page ${currentPage}`);
      notify('Page bookmarked! 🔖', 'success');
    }
  };

  const handleHighlight = async (payload) => {
    await addHighlight(payload);
    notify('Text highlighted! ✏️', 'success');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Top control bar */}
      <TopBar
        book={activeBook}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked(currentPage)}
      />

      {/* Search bar (conditionally shown below TopBar) */}
      {searchVisible && (
        <SearchOverlay
          onJumpToResult={(result) => goToPage(result.page)}
        />
      )}

      {/* Main layout: sidebar + reader */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          bookmarks={bookmarks}
          highlights={highlights}
          onRemoveBookmark={removeBookmark}
          onRemoveHighlight={removeHighlight}
          onUpdateHighlight={updateHighlight}
          onJumpPage={goToPage}
        />

        {/* PDF area + TTS panel stacked */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <PDFReader
            book={activeBook}
            highlights={highlights}
            onHighlight={handleHighlight}
            searchQuery={searchVisible ? searchQuery : ''}
            searchResults={searchResults}
            activeSearchResult={activeSearchResult}
          />

          {ttsPanelOpen && (
            <TTSPanel
              pageText={pageTextsRef.current[currentPage] || ''}
            />
          )}
        </div>
      </div>

      {/* Toast notification */}
      <Notification />
    </div>
  );
}