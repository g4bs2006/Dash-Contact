import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Database, BarChart3, Building2, Users, Shield,
    Search,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Registros', path: '/records', icon: Database },
    { label: 'Relatórios', path: '/reports', icon: BarChart3 },
    { label: 'Clientes', path: '/clients', icon: Building2, adminOnly: true },
    { label: 'Usuários', path: '/users', icon: Users, adminOnly: true },
    { label: 'Auditoria', path: '/audit', icon: Shield, adminOnly: true },
]

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const { isAdmin } = useAuth()

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const goTo = (path: string) => {
        navigate(path)
        setOpen(false)
    }

    const visibleNav = NAV_ITEMS.filter((i) => !i.adminOnly || isAdmin)

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />

                    {/* Palette */}
                    <motion.div
                        className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Command
                            className="overflow-hidden rounded-xl border shadow-float"
                            style={{
                                background: 'var(--surface-primary)',
                                borderColor: 'var(--border-default)',
                            }}
                        >
                            <div className="flex items-center gap-2 border-b px-4" style={{ borderColor: 'var(--border-default)' }}>
                                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                                <Command.Input
                                    placeholder="Buscar páginas, ações..."
                                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <kbd className="rounded bg-grafite-700 px-1.5 py-0.5 text-[10px] font-mono text-grafite-400">ESC</kbd>
                            </div>

                            <Command.List className="max-h-72 overflow-y-auto p-2">
                                <Command.Empty className="py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Nenhum resultado encontrado.
                                </Command.Empty>

                                <Command.Group heading="Navegação" className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                                    {visibleNav.map((item) => (
                                        <Command.Item
                                            key={item.path}
                                            value={item.label}
                                            onSelect={() => goTo(item.path)}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[selected=true]:bg-metal-500/15 data-[selected=true]:text-white data-[selected=true]:shadow-neon"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            <item.icon size={16} className="text-metal-400" />
                                            {item.label}
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
