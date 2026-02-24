import { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { FadeIn } from './Animations'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    title: string
    description: string
    icon?: ReactNode
    action?: ReactNode
    className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
    return (
        <FadeIn>
            <div
                className={cn(
                    "flex flex-col items-center justify-center py-12 text-center",
                    className
                )}
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised text-text-muted">
                    {icon || <Search size={32} strokeWidth={1.5} />}
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                    {title}
                </h3>
                <p className="text-sm text-text-muted max-w-sm mb-6">
                    {description}
                </p>
                {action && (
                    <div className="mt-2">
                        {action}
                    </div>
                )}
            </div>
        </FadeIn>
    )
}
