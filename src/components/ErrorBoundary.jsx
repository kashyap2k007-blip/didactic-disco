import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card text-center">
              <div className="card-header">
                <div className="mx-auto w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-danger-600 dark:text-danger-400" />
                </div>
                <h1 className="card-title text-danger-600 dark:text-danger-400">
                  Something went wrong
                </h1>
                <p className="card-description">
                  We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
                </p>
              </div>
              
              <div className="card-content">
                <div className="space-y-4">
                  <button
                    onClick={this.handleReload}
                    className="btn btn-primary w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                  </button>
                  
                  <Link
                    to="/"
                    className="btn btn-outline w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Link>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs font-mono text-neutral-700 dark:text-neutral-300 overflow-auto max-h-64">
                      <div className="mb-2">
                        <strong>Error:</strong>
                        <pre className="whitespace-pre-wrap break-words">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap break-words">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary