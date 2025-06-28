import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI instead of white page
      return (
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="error-boundary">
            <h1>🚫 Something went wrong</h1>
            <p>We're sorry, but something unexpected happened.</p>
            <div style={{ 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              padding: '15px', 
              borderRadius: '5px',
              margin: '20px 0',
              border: '1px solid #f5c6cb'
            }}>
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Reload Page
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn btn-secondary"
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
