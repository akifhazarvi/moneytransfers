"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev only
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-base font-medium text-[var(--color-on-surface)] mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 max-w-sm">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
