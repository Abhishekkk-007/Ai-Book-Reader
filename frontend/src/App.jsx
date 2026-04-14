import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ReaderProvider } from './context/ReaderContext';
import LibraryGrid from './components/Library/LibraryGrid';
import ReaderView from './ReaderView';
import ErrorBoundary from './components/ErrorBoundary';

function AppInner() {
  const { view } = useApp();

  if (view === 'reader') {
    return (
      // Separate ErrorBoundary for the reader so a crash doesn't wipe the library
      <ErrorBoundary>
        <ReaderProvider>
          <ReaderView />
        </ReaderProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LibraryGrid />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  );
}