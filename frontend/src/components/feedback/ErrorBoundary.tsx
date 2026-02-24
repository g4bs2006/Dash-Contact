import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback

            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 rounded-2xl bg-danger-500/10 p-4">
                        <AlertTriangle size={32} className="text-danger-400" />
                    </div>
                    <h3 className="text-base font-medium text-grafite-200">
                        Algo deu errado
                    </h3>
                    <p className="mt-1 max-w-sm text-center text-sm text-grafite-400">
                        Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-coral-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-500"
                    >
                        Recarregar
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
