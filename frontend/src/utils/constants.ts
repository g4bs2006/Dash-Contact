export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Clientes contact.IA'

export const ROLES = {
    ADMIN: 'admin',
    FUNCIONARIO: 'funcionario',
} as const

export const STATUS = {
    ATIVO: 'ativo',
    INATIVO: 'inativo',
} as const

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 20,
    MAX_PER_PAGE: 100,
} as const

export const PERIODOS = [
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mês' },
    { value: 'ano', label: 'Ano' },
] as const

export const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/records', label: 'Registros', icon: 'Database' },
    { path: '/reports', label: 'Relatórios', icon: 'BarChart3' },
    { path: '/clients', label: 'Clientes', icon: 'Building2', adminOnly: true },
    { path: '/users', label: 'Usuários', icon: 'Users', adminOnly: true },
    { path: '/audit', label: 'Auditoria', icon: 'Shield', adminOnly: true },
] as const
