import { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '@single-spa-demo/shared-library';

interface IProps {
  children: ReactNode;
  fallback?: ReactNode;
  mfeName?: string;
}

interface IState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const mfeName = this.props.mfeName || 'react-mfe';
    errorLogger.logError(error, mfeName, 'critical', {
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff4444',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#cc0000' }}>⚠️ Something went wrong</h2>
          <p>The application encountered an error. Please try refreshing the page.</p>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Error details</summary>
            <pre style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => globalThis.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
