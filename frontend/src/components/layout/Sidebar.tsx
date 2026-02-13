import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Database,
    BarChart3,
    Building2,
    Users,
    Shield,
    LogOut,
    ChevronLeft,
    type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/utils/constants'

const ICON_MAP: Record<string, LucideIcon> = {
    LayoutDashboard,
    Database,
    BarChart3,
    Building2,
    Users,
    Shield,
}

interface NavItem {
    path: string
    label: string
    icon: string
    adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/records', label: 'Registros', icon: 'Database' },
    { path: '/reports', label: 'Relatórios', icon: 'BarChart3' },
    { path: '/clients', label: 'Clientes', icon: 'Building2', adminOnly: true },
    { path: '/users', label: 'Usuários', icon: 'Users', adminOnly: true },
    { path: '/audit', label: 'Auditoria', icon: 'Shield', adminOnly: true },
]

interface SidebarProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const { isAdmin, logout, user } = useAuth()
    const location = useLocation()


    const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 flex h-screen flex-col
                backdrop-blur-xl transition-all duration-300 ease-out
                ${collapsed ? 'w-16' : 'w-60'}
            `}
            style={{
                background: 'color-mix(in srgb, var(--surface-primary) 85%, transparent)',
                borderRight: '1px solid var(--border-default)',
            }}
        >
            {/* Logo with glow */}
            <div
                className="relative flex h-16 items-center gap-3 px-4"
                style={{ borderBottom: '1px solid var(--border-default)' }}
            >
                {/* Subtle glow behind logo */}
                <div className="absolute -left-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-roxo-500/10 blur-xl" />
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: 'var(--gradient-brand)' }}>
                    C
                </div>
                {!collapsed && (
                    <span className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {APP_NAME}
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                {visibleItems.map((item) => {
                    const Icon = ICON_MAP[item.icon]
                    const isActive = location.pathname.startsWith(item.path)

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`
                                group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                                text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-roxo-600/15 text-roxo-400'
                                    : 'hover:translate-x-0.5'
                                }
                            `}
                            style={!isActive ? { color: 'var(--text-muted)' } : undefined}
                            title={collapsed ? item.label : undefined}
                        >
                            {/* Active indicator bar */}
                            <div
                                className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200 ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
                                style={{ background: isActive ? 'var(--gradient-brand)' : undefined }}
                            />
                            {Icon && (
                                <Icon
                                    size={20}
                                    className={`shrink-0 transition-colors ${isActive ? 'text-roxo-400' : 'text-grafite-400 group-hover:text-roxo-300'}`}
                                />
                            )}
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                {/* User info */}
                {!collapsed && user && (
                    <div className="mb-3 rounded-lg px-3 py-2" style={{ background: 'var(--surface-raised)' }}>
                        <p className="truncate text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{user.name}</p>
                        <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={logout}
                        className="btn-press flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-danger-500/10 hover:text-danger-400"
                        style={{ color: 'var(--text-muted)' }}
                        title="Sair"
                    >
                        <LogOut size={18} />
                        {!collapsed && <span>Sair</span>}
                    </button>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="btn-press rounded-lg p-2 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        title={collapsed ? 'Expandir' : 'Recolher'}
                    >
                        <ChevronLeft
                            size={18}
                            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>
        </aside>
    )
}
