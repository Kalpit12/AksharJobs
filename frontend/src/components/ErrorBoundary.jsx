import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now() // Generate unique error ID
    };
  }

  componentDidCatch(error, errorInfo) {
    try {
      // Log the error to console for debugging
      console.error('ErrorBoundary caught an error:', error, errorInfo);
      this.setState({
        error: error,
        errorInfo: errorInfo
      });
    } catch (setStateError) {
      console.error('ErrorBoundary failed to set state:', setStateError);
    }
  }

  handleRetry = () => {
    try {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    } catch (error) {
      console.error('ErrorBoundary retry failed:', error);
      window.location.reload();
    }
  }

  render() {
    try {
      if (this.state.hasError) {
        // Fallback UI with minimal dependencies
        return (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            margin: '2rem',
            fontFamily: 'Arial, sans-serif'
          }}>
            <h2 style={{ 
              color: '#dc3545', 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Something went wrong
            </h2>
            <p style={{ 
              color: '#6c757d', 
              marginBottom: '1rem',
              fontSize: '1rem'
            }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.8rem',
                  maxHeight: '300px'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <>
                      <br /><br />
                      Component Stack:
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        );
      }

      return this.props.children;
    } catch (renderError) {
      // If even the error boundary render fails, show a minimal fallback
      console.error('ErrorBoundary render failed:', renderError);
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2 style={{ color: '#dc3545' }}>Critical Error</h2>
          <p>Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      );
    }
  }
}

export default ErrorBoundary;