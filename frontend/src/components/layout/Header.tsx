import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
    title: string
    subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    const { user, isAdmin } = useAuth()
    const { theme, toggle } = useTheme()

    return (
        <header
            className="flex h-16 items-center justify-between px-6 backdrop-blur-sm transition-colors duration-200"
            style={{
                background: 'color-mix(in srgb, var(--surface-primary) 80%, transparent)',
                borderBottom: '1px solid var(--border-default)',
            }}
        >
            {/* Left: Title */}
            <div>
                <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                {subtitle && (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Ctrl+K hint */}
                <button
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                    className="btn-press flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors"
                    style={{
                        background: 'var(--surface-raised)',
                        color: 'var(--text-muted)',
                    }}
                >
                    <Search size={14} />
                    <span className="hidden sm:inline">Buscar...</span>
                    <kbd className="rounded px-1 py-0.5 text-[10px] font-mono" style={{ background: 'var(--surface-overlay)' }}>Ctrl+K</kbd>
                </button>

                {/* Theme toggle */}
                <button
                    onClick={toggle}
                    className="btn-press relative rounded-lg p-2 transition-colors hover:bg-roxo-600/10"
                    style={{ color: 'var(--text-muted)' }}
                    aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={theme}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="block"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.span>
                    </AnimatePresence>
                </button>

                {/* Notifications */}
                <button
                    className="btn-press relative rounded-lg p-2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <Bell size={18} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-roxo-500" />
                </button>

                {/* User badge */}
                <div
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                    style={{ background: 'var(--surface-raised)' }}
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'var(--gradient-brand)' }}>
                        {user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {isAdmin ? 'Administrador' : 'Funcionário'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}
