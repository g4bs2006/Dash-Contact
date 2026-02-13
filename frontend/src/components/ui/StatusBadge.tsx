interface StatusBadgeProps {
    status: string | null
    size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    // Record statuses
    'Concluído': { bg: 'rgba(34,197,94,0.1)', text: '#4ade80' },
    'Confirmado': { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
    'Pendente': { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24' },
    'Cancelado': { bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
    'Enviado': { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },

    // Entity statuses
    'ativo': { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
    'Ativo': { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
    'inativo': { bg: 'var(--surface-overlay)', text: 'var(--text-muted)' },
    'Inativo': { bg: 'var(--surface-overlay)', text: 'var(--text-muted)' },

    // Role badges
    'admin': { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
    'Administrador': { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
    'funcionario': { bg: 'var(--surface-overlay)', text: 'var(--text-muted)' },
    'Funcionário': { bg: 'var(--surface-overlay)', text: 'var(--text-muted)' },
}

const LABELS: Record<string, string> = {
    'ativo': 'Ativo',
    'inativo': 'Inativo',
    'admin': 'Administrador',
    'funcionario': 'Funcionário',
}

const DEFAULT_STYLE = { bg: 'var(--surface-overlay)', text: 'var(--text-muted)' }

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    if (!status) return <span style={{ color: 'var(--text-faint)' }}>—</span>

    const style = STATUS_STYLES[status] ?? DEFAULT_STYLE
    const label = LABELS[status] ?? status

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-2.5 py-1 text-xs'

    return (
        <span
            className={`inline-flex items-center rounded-md font-medium ${sizeClasses}`}
            style={{ backgroundColor: style.bg, color: style.text }}
        >
            {label}
        </span>
    )
}
