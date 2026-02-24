interface StatusBadgeProps {
    status: string | null
    size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    // Record statuses (AdFile/Vibrant Style)
    'Concluído': { bg: 'rgba(13, 211, 179, 0.1)', text: 'var(--color-success-500)' },
    'Confirmado': { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--color-info-500)' },
    'Pendente': { bg: 'rgba(245, 166, 35, 0.1)', text: 'var(--color-warning-500)' },
    'Cancelado': { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--color-danger-500)' },
    'Enviado': { bg: 'rgba(232, 42, 113, 0.15)', text: 'var(--color-metal-400)' },

    // Entity statuses
    'ativo': { bg: 'rgba(13, 211, 179, 0.1)', text: 'var(--color-success-500)' },
    'Ativo': { bg: 'rgba(13, 211, 179, 0.1)', text: 'var(--color-success-500)' },
    'inativo': { bg: 'var(--surface-raised)', text: 'var(--text-muted)' },
    'Inativo': { bg: 'var(--surface-raised)', text: 'var(--text-muted)' },

    // Role badges
    'admin': { bg: 'rgba(232, 42, 113, 0.1)', text: 'var(--color-metal-400)' },
    'Administrador': { bg: 'rgba(232, 42, 113, 0.1)', text: 'var(--color-metal-400)' },
    'funcionario': { bg: 'var(--surface-raised)', text: 'var(--text-muted)' },
    'Funcionário': { bg: 'var(--surface-raised)', text: 'var(--text-muted)' },
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
