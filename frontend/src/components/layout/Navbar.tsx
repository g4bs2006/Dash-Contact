import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Database,
    BarChart3,
    Building2,
    Users,
    Shield,
    LogOut,
    type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/utils/constants'
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

export function Navbar() {
    const { isAdmin, logout, user } = useAuth()

    const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl rounded-2xl border border-border-default bg-surface-primary/60 backdrop-blur-2xl shadow-elevated transition-all duration-300">
            <div className="flex h-16 items-center justify-between px-6">

                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-white shadow-neon" style={{ background: 'var(--gradient-brand)' }}>
                        D
                        <div className="absolute inset-0 rounded-xl bg-white/20 blur-md mix-blend-overlay" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                        {APP_NAME}
                    </span>
                </div>

                {/* Navigation Pills */}
                <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 justify-center px-4">
                    {visibleItems.map((item) => {
                        const Icon = ICON_MAP[item.icon]
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                                    isActive
                                        ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                        : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {Icon && (
                                            <Icon
                                                size={18}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={cn(
                                                    "shrink-0 transition-colors duration-300",
                                                    isActive ? "text-coral-400" : "text-text-faint"
                                                )}
                                            />
                                        )}
                                        <span className="hidden md:block break-keep whitespace-nowrap">{item.label}</span>
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-t-full bg-coral-500 shadow-neon" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* User & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden lg:flex flex-col items-end mr-2">
                        <span className="text-sm font-bold text-white leading-tight">{user?.name}</span>
                        <span className="text-xs text-text-muted">{user?.email}</span>
                    </div>

                    <button
                        onClick={logout}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-raised text-text-muted transition-all hover:bg-danger-500/20 hover:text-danger-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95"
                        title="Sair do sistema"
                    >
                        <LogOut size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </header>
    )
}
