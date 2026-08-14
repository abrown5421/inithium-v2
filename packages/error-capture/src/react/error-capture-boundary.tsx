import * as React from 'react';
import { reportError } from '../lib/capture.js';

export interface ErrorCaptureBoundaryProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

interface ErrorCaptureBoundaryState {
  readonly hasError: boolean;
}

const DefaultFallback: React.FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
    <p className="text-lg font-medium">Something went wrong.</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
    >
      Reload
    </button>
  </div>
);

export class ErrorCaptureBoundary extends React.Component<ErrorCaptureBoundaryProps, ErrorCaptureBoundaryState> {
  override state: ErrorCaptureBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorCaptureBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown): void {
    reportError(error);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />;
    }
    return this.props.children;
  }
}
