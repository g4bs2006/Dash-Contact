import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:scale-105"
                style={{ background: 'var(--surface-raised)' }}
            >
                <Icon size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
