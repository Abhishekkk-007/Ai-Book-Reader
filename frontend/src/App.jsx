import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ReaderProvider } from './context/ReaderContext';
import LibraryGrid from './components/Library/LibraryGrid';
import ReaderView from './ReaderView';

function AppInner() {
  const { view } = useApp();

  if (view === 'reader') {
    return (
      <ReaderProvider>
        <ReaderView />
      </ReaderProvider>
    );
  }

  return <LibraryGrid />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}