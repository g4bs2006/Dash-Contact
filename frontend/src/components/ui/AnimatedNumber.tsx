import { useEffect, useRef, useCallback } from 'react'
import { formatNumber } from '@/utils/formatters'

interface AnimatedNumberProps {
    value: number
    duration?: number
    format?: 'number' | 'raw'
}

/**
 * Animated counter that directly mutates the DOM instead of using setState,
 * avoiding 60fps re-renders across the entire component tree.
 */
export function AnimatedNumber({ value, duration = 800, format = 'number' }: AnimatedNumberProps) {
    const spanRef = useRef<HTMLSpanElement>(null)
    const rafId = useRef(0)

    const formatValue = useCallback(
        (v: number) => (format === 'number' ? formatNumber(v) : String(v)),
        [format]
    )

    useEffect(() => {
        const el = spanRef.current
        if (!el) return

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            el.textContent = formatValue(value)
            return
        }

        let start: number | null = null

        const animate = (timestamp: number) => {
            if (start === null) start = timestamp
            const elapsed = timestamp - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            el.textContent = formatValue(Math.round(eased * value))

            if (progress < 1) {
                rafId.current = requestAnimationFrame(animate)
            }
        }

        rafId.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId.current)
    }, [value, duration, formatValue])

    return <span ref={spanRef}>{formatValue(0)}</span>
}
