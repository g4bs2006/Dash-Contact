import { useEffect, useRef, useState, type ReactNode } from 'react'

interface StaggeredListProps {
    children: ReactNode[]
    delayMs?: number
    className?: string
}

/**
 * Wraps children with staggered fade-in + slide-up animation.
 * Each child enters 50ms after the previous one.
 */
export function StaggeredList({ children, delayMs = 50, className = '' }: StaggeredListProps) {
    return (
        <div className={className}>
            {children.map((child, i) => (
                <StaggeredItem key={i} index={i} delayMs={delayMs}>
                    {child}
                </StaggeredItem>
            ))}
        </div>
    )
}

interface StaggeredItemProps {
    children: ReactNode
    index: number
    delayMs: number
}

function StaggeredItem({ children, index, delayMs }: StaggeredItemProps) {
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            setVisible(true)
            return
        }

        const timer = setTimeout(() => setVisible(true), index * delayMs)
        return () => clearTimeout(timer)
    }, [index, delayMs])

    return (
        <div
            ref={ref}
            className="transition-all duration-500 ease-out"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
            }}
        >
            {children}
        </div>
    )
}

interface FadeInProps {
    children: ReactNode
    delayMs?: number
    className?: string
}

/**
 * Single element fade-in + slide-up on mount.
 */
export function FadeIn({ children, delayMs = 0, className = '' }: FadeInProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            setVisible(true)
            return
        }

        const timer = setTimeout(() => setVisible(true), delayMs)
        return () => clearTimeout(timer)
    }, [delayMs])

    return (
        <div
            className={`transition-all duration-500 ease-out ${className}`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
            }}
        >
            {children}
        </div>
    )
}
