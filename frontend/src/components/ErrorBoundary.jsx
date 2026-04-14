import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-6 p-8 bg-[var(--bg-primary)] text-center">
          <div className="text-6xl">💥</div>
          <div className="max-w-lg">
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              An unexpected error occurred. This is often caused by a network or
              configuration issue in production.
            </p>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 text-left mb-4">
              <p className="text-xs font-mono text-red-400 break-all">
                {this.state.error.toString()}
              </p>
            </div>
            <div className="text-xs text-[var(--text-muted)] text-left space-y-1 bg-[var(--bg-secondary)] rounded-lg p-3 mb-5">
              <p className="font-semibold text-[var(--text-secondary)] mb-2">Quick debug checklist:</p>
              <p>1. Open DevTools → Console — look for red errors</p>
              <p>2. Open DevTools → Network — look for 4xx/5xx or CORS failures</p>
              <p>3. Check that <code className="bg-[var(--bg-card)] px-1 rounded">VITE_API_URL</code> is set in Render frontend env</p>
              <p>4. Check that <code className="bg-[var(--bg-card)] px-1 rounded">ALLOWED_ORIGINS</code> includes your frontend URL in backend env</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => this.setState({ error: null })}
            >
              Try Again
            </button>
            <button
              className="btn-ghost ml-3"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}