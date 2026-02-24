import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { formatPercentage } from '@/utils/formatters'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'

interface KPICardProps {
    title: string
    value: number
    icon: LucideIcon
    variation?: number
    format?: 'number' | 'raw'
    details?: {
        previousWeek?: number
        monthlyAvg?: number
        max?: number
    }
}

export function KPICard({
    title,
    value,
    icon: Icon,
    variation,
    format = 'number',
    details
}: KPICardProps) {
    const [expanded, setExpanded] = useState(false)

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
        <motion.div
            layout
            onHoverStart={() => setExpanded(true)}
            onHoverEnd={() => setExpanded(false)}
            className="card-lift group relative overflow-hidden rounded-xl border p-5 cursor-pointer"
            style={{
                background: 'var(--surface-primary)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card-val)',
            }}
            animate={{
                minHeight: expanded && details ? '240px' : '140px'
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

            {/* Expanded content - slides in from bottom */}
            <AnimatePresence>
                {expanded && details && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-3 border-t border-border-default pt-4"
                    >
                        {details.previousWeek !== undefined && (
                            <div className="flex items-center justify-between text-xs">
                                <span style={{ color: 'var(--text-muted)' }}>Semana anterior</span>
                                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {details.previousWeek}
                                </span>
                            </div>
                        )}

                        {details.monthlyAvg !== undefined && (
                            <div className="flex items-center justify-between text-xs">
                                <span style={{ color: 'var(--text-muted)' }}>Média mensal</span>
                                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {details.monthlyAvg}
                                </span>
                            </div>
                        )}

                        {details.max !== undefined && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span style={{ color: 'var(--text-muted)' }}>Progresso para meta</span>
                                    <span className="font-semibold" style={{ color: 'var(--color-coral-400)' }}>
                                        {Math.round((value / details.max) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-raised)' }}>
                                    <motion.div
                                        className="h-full"
                                        style={{ background: 'var(--gradient-brand)' }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(value / details.max) * 100}%` }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
