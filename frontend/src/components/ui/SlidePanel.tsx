import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlidePanelProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    width?: 'md' | 'lg' | 'xl'
}

export function SlidePanel({ isOpen, onClose, title, children, width = 'md' }: SlidePanelProps) {
    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const widthClass = {
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }[width]

    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    if (!mounted) return null

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-4 bottom-4 right-4 z-50 w-full flex flex-col rounded-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    "border border-border-default bg-surface-base",
                    widthClass,
                    isOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-default px-6 py-4 bg-surface-primary rounded-t-2xl">
                    <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-text-muted hover:bg-surface-raised hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {children}
                </div>
            </div>
        </>,
        document.body
    )
}
