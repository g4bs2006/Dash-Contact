import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    size?: number
    className?: string
    text?: string
}

export function LoadingSpinner({ size = 24, className = '', text }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 size={size} className="animate-spin text-roxo-400" />
            {text && <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>{text}</p>}
        </div>
    )
}
