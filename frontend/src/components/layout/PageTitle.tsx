interface PageTitleProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export function PageTitle({ title, subtitle, actions }: PageTitleProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    )
}
