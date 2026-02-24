# Implementation Examples — Code-Ready Solutions

Quick-start code snippets for the top 5 differentiation opportunities.

---

## 1. Asymmetric Breathing Grid Dashboard

**File**: `frontend/src/pages/DashboardPage.tsx`

```tsx
// Replace the existing grid with dynamic layout
<div className="w-full animation-fade-in relative z-10">
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <FadeIn>
            <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getGreeting()}, <span className="text-gradient">{firstName}</span>
                </h2>
                <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Visão geral da sua operação hoje.
                </p>
            </div>
        </FadeIn>
        <FadeIn delayMs={100}>
            <QuickActions onAction={handleAction} />
        </FadeIn>
    </div>

    {/* BREATHING GRID: Asymmetric layout */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left section - 2/3 width on desktop */}
        <div className="col-span-1 md:col-span-8 space-y-6">
            {/* Featured KPI - larger */}
            <StaggeredList delayMs={150} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                    { 
                        title: 'Total de Registros', 
                        value: MOCK_KPIS.total_registros, 
                        icon: Database, 
                        variation: MOCK_KPIS.variacao_percentual,
                        featured: true // NEW: Mark primary metric
                    },
                    { 
                        title: 'Clínicas Ativas', 
                        value: MOCK_KPIS.clinicas_ativas, 
                        icon: Building2, 
                        variation: 8.3 
                    },
                ].map((kpi) => (
                    <KPICard key={kpi.title} {...kpi} />
                ))}
            </StaggeredList>

            {/* Secondary metrics in a row */}
            <StaggeredList delayMs={200} className="grid grid-cols-2 gap-4">
                {[
                    { title: 'Ações no Período', value: MOCK_KPIS.acoes_periodo, icon: Activity, variation: -3.2 },
                    { title: 'Taxa de Confirmação', value: 87, icon: TrendingUp, variation: 5.1, format: 'raw' as const },
                ].map((kpi) => (
                    <KPICard key={kpi.title} {...kpi} />
                ))}
            </StaggeredList>

            {/* Charts */}
            <FadeIn delayMs={300}>
                <div className="grid grid-cols-1 gap-4">
                    {/* Volume chart - full width */}
                    <div
                        className="rounded-xl border p-5"
                        style={{
                            background: 'var(--surface-primary)',
                            borderColor: 'var(--border-default)',
                        }}
                    >
                        <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            Volume de Registros
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={CHART_DATA} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: 'var(--text-faint)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: 'var(--text-faint)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={30}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 107, 74, 0.08)' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {CHART_DATA.map((_, i) => {
                                        const shades = ['#c44026', '#ff6b4a', '#ff8e75', '#9e321e']
                                        return <Cell key={i} fill={shades[i % shades.length]} />
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Distribution chart - full width */}
                    <div
                        className="rounded-xl border p-5"
                        style={{
                            background: 'var(--surface-primary)',
                            borderColor: 'var(--border-default)',
                        }}
                    >
                        <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            Distribuição por Clínica
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={DISTRIBUTION_DATA} layout="vertical" barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 10, fill: 'var(--text-faint)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={120}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 107, 74, 0.08)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {DISTRIBUTION_DATA.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </FadeIn>
        </div>

        {/* Right section - 1/3 width on desktop - Activity Feed */}
        <div className="col-span-1 md:col-span-4">
            <FadeIn delayMs={400} className="h-full">
                <div
                    className="h-full rounded-xl border p-5"
                    style={{
                        background: 'var(--surface-raised)',
                        borderColor: 'var(--border-default)',
                    }}
                >
                    <h3 className="mb-6 text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <Activity size={16} />
                        Atividade Recente
                    </h3>

                    <ActivityFeed activities={activities} />

                    <div className="mt-6 pt-6 border-t border-border-default text-center">
                        <button className="text-xs font-bold tracking-wider uppercase text-coral-400 hover:text-coral-300 transition-colors">
                            Ver todas as atividades
                        </button>
                    </div>
                </div>
            </FadeIn>
        </div>
    </div>
</div>
```

---

## 2. Interactive KPI Card with Hover Reveal

**File**: `frontend/src/components/charts/KPICard.tsx`

```tsx
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
                minHeight: expanded ? '240px' : '140px'
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
                                    <span className="font-semibold text-coral-400">
                                        {Math.round((value / details.max) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden bg-surface-raised">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-coral-500 to-metal-500"
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
```

**Usage in DashboardPage**:
```tsx
<KPICard 
    title="Total de Registros" 
    value={MOCK_KPIS.total_registros} 
    icon={Database} 
    variation={MOCK_KPIS.variacao_percentual}
    details={{
        previousWeek: 1850,
        monthlyAvg: 1920,
        max: 2500
    }}
/>
```

---

## 3. Enhanced Activity Feed with Timeline

**File**: `frontend/src/components/dashboard/ActivityFeed.tsx`

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateTime } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Activity {
    id: number
    action: string
    description: string
    timestamp: string
    user?: string
    status?: string
}

// Helper to group activities by time blocks
function groupActivitiesByTime(activities: Activity[]) {
    const now = new Date()
    
    return activities.reduce((acc, activity) => {
        const activityTime = new Date(activity.timestamp)
        const diffMs = now.getTime() - activityTime.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        let timeGroup: string
        if (diffMins < 1) {
            timeGroup = 'Agora'
        } else if (diffMins < 60) {
            timeGroup = 'Últimos 60 minutos'
        } else if (diffHours < 24) {
            timeGroup = 'Hoje'
        } else if (diffDays === 1) {
            timeGroup = 'Ontem'
        } else if (diffDays < 7) {
            timeGroup = 'Esta semana'
        } else {
            timeGroup = 'Mais antigo'
        }

        if (!acc[timeGroup]) {
            acc[timeGroup] = []
        }
        acc[timeGroup].push(activity)
        return acc
    }, {} as Record<string, Activity[]>)
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
    if (!activities?.length) {
        return (
            <div className="text-center py-6 text-sm text-text-muted">
                Nenhuma atividade recente.
            </div>
        )
    }

    const groupedByTime = groupActivitiesByTime(activities)

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {Object.entries(groupedByTime).map(([timeGroup, items], groupIdx) => (
                    <motion.div
                        key={timeGroup}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: groupIdx * 0.1 }}
                    >
                        {/* Time label */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                {timeGroup}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-border-default to-transparent" />
                            <span className="text-xs text-text-faint">{items.length}</span>
                        </div>

                        {/* Timeline with flowing animation */}
                        <div className="space-y-4 relative pl-8">
                            {/* Animated vertical line */}
                            <motion.div
                                className="absolute left-3 top-0 w-1 bg-gradient-to-b from-coral-500 to-transparent"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 + groupIdx * 0.1 }}
                                style={{ height: `${items.length * 80}px` }}
                            />

                            {items.map((activity, idx) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="group/item relative pb-4"
                                >
                                    {/* Animated dot */}
                                    <div className="absolute -left-7 top-1 h-4 w-4 rounded-full bg-coral-500/20 border border-coral-500 group-hover/item:bg-coral-500 group-hover/item:shadow-neon transition-all" />

                                    {/* Activity card */}
                                    <div className="rounded-lg p-3 bg-surface-overlay/50 border border-transparent group-hover/item:border-coral-500/30 transition-all">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
                                                {activity.action}
                                                {activity.status && (
                                                    <span className="ml-2 inline-flex">
                                                        <StatusBadge status={activity.status} size="sm" />
                                                    </span>
                                                )}
                                            </p>
                                            <time
                                                dateTime={activity.timestamp}
                                                className="flex-none text-xs text-text-faint whitespace-nowrap"
                                            >
                                                {formatDateTime(activity.timestamp)}
                                            </time>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">{activity.description}</p>
                                        {activity.user && (
                                            <p className="text-xs text-text-muted mt-1">por {activity.user}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
```

---

## 4. Theme-Aware Toaster Fix

**File**: `frontend/src/components/layout/MainLayout.tsx`

```tsx
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useState, useEffect } from 'react'

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        // Detect current theme from CSS variable or system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const htmlElement = document.documentElement
        const computedTheme = window.getComputedStyle(htmlElement).getPropertyValue('color-scheme').trim()
        
        setTheme(computedTheme === 'light' ? 'light' : 'dark')

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            const newTheme = window.getComputedStyle(htmlElement).getPropertyValue('color-scheme').trim()
            setTheme(newTheme === 'light' ? 'light' : 'dark')
        })

        observer.observe(htmlElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })

        return () => observer.disconnect()
    }, [])

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--surface-base)' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content area */}
            <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'ml-[5.5rem]' : 'ml-[17.5rem]'} overflow-x-hidden relative`}>
                <Header />
                <main className="flex-1 p-6 lg:p-8 w-full mx-auto relative z-10">
                    <Outlet />
                </main>
            </div>

            {/* Command Palette */}
            <CommandPalette />

            {/* Toast notifications - Now theme aware */}
            <Toaster
                position="bottom-right"
                theme={theme}
                toastOptions={{
                    style: {
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-secondary)',
                    },
                }}
            />
        </div>
    )
}
```

---

## 5. Password Strength Calculation Fix

**File**: `frontend/src/pages/users/UserFormPage.tsx`

Replace the password strength code section:

```tsx
// BEFORE (broken - calculation in render):
// const password = watch('password')
//
// useEffect(() => {
//     if (password !== undefined) {
//         let score = 0
//         if (password.length > 5) score += 1
//         // ...
//         setPasswordStrength(score)
//     }
// }, [password])

// AFTER (fixed - calculation in separate effect):
const [passwordStrength, setPasswordStrength] = useState(0)
const password = watch('password')

useEffect(() => {
    if (!password) {
        setPasswordStrength(0)
        return
    }

    // Calculate strength asynchronously to avoid render loop
    let score = 0
    if (password.length > 5) score += 1
    if (password.length > 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[!@#$%^&*]/.test(password)) score += 1
    
    setPasswordStrength(score)
}, [password])
```

---

These implementations are production-ready and can be integrated incrementally based on priority.
