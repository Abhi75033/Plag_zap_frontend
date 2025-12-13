import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Log to error reporting service in production
        if (process.env.NODE_ENV === 'production') {
            // Example: logErrorToService(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#3c4043] rounded-xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-8 h-8 text-[#ea4335]" />
                            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
                        </div>
                        
                        <p className="text-gray-300 mb-4">
                            We're sorry, but something unexpected happened. The error has been logged.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 p-3 bg-[#202124] rounded-lg">
                                <summary className="text-sm text-gray-400 cursor-pointer mb-2">
                                    Error Details (Development)
                                </summary>
                                <pre className="text-xs text-red-400 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg transition-colors"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 px-4 py-2 bg-[#5f6368] hover:bg-[#7c8085] text-white rounded-lg transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
