import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { formatPercentage } from '@/utils/formatters'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'

interface KPICardProps {
    title: string
    value: number
    icon: LucideIcon
    variation?: number
    format?: 'number' | 'raw'
}

export function KPICard({ title, value, icon: Icon, variation, format = 'number' }: KPICardProps) {
    const TrendIcon = variation
        ? variation > 0
            ? TrendingUp
            : variation < 0
                ? TrendingDown
                : Minus
        : null

    const trendColor = variation
        ? variation > 0
            ? 'text-success-400'
            : variation < 0
                ? 'text-danger-400'
                : 'text-grafite-400'
        : ''

    const borderGradient = variation
        ? variation > 0
            ? 'from-success-500/40 to-transparent'
            : variation < 0
                ? 'from-danger-500/40 to-transparent'
                : 'from-grafite-600 to-transparent'
        : 'from-grafite-700 to-transparent'

    return (
        <div
            className="card-lift group relative overflow-hidden rounded-xl border p-5"
            style={{
                background: 'var(--surface-primary)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card-val)',
            }}
        >
            {/* Bottom gradient accent */}
            <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${borderGradient}`} />
            <div className="flex items-start justify-between">
                <div className="rounded-lg bg-coral-600/10 p-2.5">
                    <Icon size={20} className="text-coral-400" />
                </div>
                {variation !== undefined && TrendIcon && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                        <TrendIcon size={14} />
                        <span>{formatPercentage(variation)}</span>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {title}
                </p>
                <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    <AnimatedNumber value={value} format={format} />
                </p>
            </div>
        </div>
    )
}
