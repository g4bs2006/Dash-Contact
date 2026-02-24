import { NavLink } from 'react-router-dom'
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
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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



    const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

    return (
        <aside
            className={cn(
                "fixed left-4 top-4 z-40 flex h-[calc(100vh-2rem)] flex-col rounded-xl",
                "transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.2)",
                "border border-border-default bg-surface-primary shadow-float",
                collapsed ? 'w-16' : 'w-64'
            )}
            style={{ backdropFilter: 'blur(20px)' }}
        >
            {/* Logo with glow */}
            <div
                className={cn(
                    "relative flex h-16 items-center",
                    collapsed ? "justify-center px-0" : "gap-3 px-4"
                )}
            >
                {/* Metálico Divider Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: 'var(--gradient-brand)', opacity: 0.3 }} />

                <div className="relative flex shrink-0 items-center justify-center">
                    <div className="absolute h-12 w-12 rounded-full bg-metal-500/20 blur-xl" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-sm text-sm font-black text-white shadow-neon" style={{ background: 'var(--gradient-brand)' }}>
                        DC
                    </div>
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
                    // const isActive = location.pathname.startsWith(item.path) // This is now handled by NavLink's render prop

                    return (
                        <div className="relative group/item" key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "relative flex items-center gap-3 rounded-md mx-2 px-3 py-3 text-sm font-bold tracking-tight transition-all duration-300",
                                    isActive && !collapsed
                                        ? "text-white shadow-neon flex-1"
                                        : isActive && collapsed ? "text-white" : "border-transparent text-text-muted hover:bg-surface-raised hover:text-text-primary hover:translate-x-1"
                                )}
                                style={({ isActive }) => isActive && !collapsed ? { background: 'var(--gradient-brand-soft)', border: '1px solid rgba(255, 116, 166, 0.4)' } : undefined}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active indicator bar */}
                                        <div
                                            className={cn(
                                                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 transition-all duration-300 rounded-r-md",
                                                isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                                            )}
                                            style={isActive ? { background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-neon)' } : undefined}
                                        />

                                        {Icon && (
                                            <Icon
                                                size={20}
                                                className={cn(
                                                    "shrink-0 transition-colors",
                                                    isActive ? "text-metal-400" : "text-text-muted group-hover:text-metal-300"
                                                )}
                                                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,116,166,0.6))' } : undefined}
                                            />
                                        )}

                                        {!collapsed && <span>{item.label}</span>}
                                    </>
                                )}
                            </NavLink>

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-md bg-grafite-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/item:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 relative">
                {/* Metálico Divider Line */}
                <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'var(--gradient-brand)', opacity: 0.3 }} />
                {/* User info */}
                {!collapsed && user && (
                    <div className="mb-3 rounded-lg px-3 py-2" style={{ background: 'var(--surface-raised)' }}>
                        <p className="truncate text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{user.name}</p>
                        <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                )}

                {/* Actions */}
                <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "")}>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className={cn(
                            "flex-1 items-center gap-2 rounded-sm font-bold uppercase tracking-wider text-grafite-400 transition-colors hover:bg-red-500/10 hover:text-red-400",
                            collapsed ? "px-0 justify-center w-full" : "justify-start px-3"
                        )}
                        title="Sair"
                    >
                        <LogOut size={16} strokeWidth={2.5} />
                        {!collapsed && <span>Sair</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-sm shrink-0"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expandir' : 'Recolher'}
                    >
                        <ChevronLeft
                            size={18}
                            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                        />
                    </Button>
                </div>
            </div>
        </aside>
    )
}
