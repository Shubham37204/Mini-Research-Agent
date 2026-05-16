import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-xl space-y-4 min-h-[200px]">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-bold text-red-500">Component Crashed</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              {this.state.error?.message || 'An unexpected error occurred in this module.'}
            </p>
          </div>
          <button 
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <RotateCcw size={14} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
