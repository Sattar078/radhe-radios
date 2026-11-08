import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#080808] text-[#F5F5F5]">
          <div className="w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-[#F5F5F5] mb-3">
            Audio Interface Interrupted
          </h2>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed mb-6 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred. Please refresh the page.'}
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00e5ff] text-[#080808] font-bold text-xs uppercase tracking-wider hover:bg-[#38bdf8] transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Experience</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
