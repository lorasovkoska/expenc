'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// basic error boundary just to catch chart / render blowups
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-6 bg-red-50 text-red-800 rounded-lg border border-red-200"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="text-sm mt-1">{this.state.error?.message ?? 'Unknown error'}</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Try loading the app again"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
