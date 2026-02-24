import { KPICard } from '@/components/charts/KPICard'
import { StaggeredList, FadeIn } from '@/components/ui/Animations'
import { Database, Building2, Activity, TrendingUp } from 'lucide-react'
import { MOCK_KPIS, MOCK_RECORDS } from '@/mocks/data'
import { useAuth } from '@/hooks/useAuth'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Cell,
} from 'recharts'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { toast } from 'sonner'

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
}

const CHART_DATA = [
    { name: 'Fev 1', value: 40 },
    { name: 'Fev 2', value: 65 },
    { name: 'Fev 3', value: 45 },
    { name: 'Fev 4', value: 80 },
    { name: 'Fev 5', value: 55 },
    { name: 'Fev 6', value: 90 },
    { name: 'Fev 7', value: 70 },
    { name: 'Fev 8', value: 85 },
    { name: 'Fev 9', value: 60 },
    { name: 'Fev 10', value: 75 },
    { name: 'Fev 11', value: 95 },
    { name: 'Fev 12', value: 68 },
]

const DISTRIBUTION_DATA = [
    { name: 'Clínica Saúde Plena', value: 560, fill: '#ff6b4a' },
    { name: 'OdontoVita', value: 311, fill: '#ff8e75' },
    { name: 'Clínica Renovar', value: 224, fill: '#c44026' },
    { name: 'Bem Estar', value: 150, fill: '#ffd4cc' },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length) return null
    return (
        <div
            className="rounded-lg border px-3 py-2 text-xs shadow-float"
            style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
            }}
        >
            <p className="font-medium text-white">{label}</p>
            <p className="text-coral-400">{payload?.[0]?.value} registros</p>
        </div>
    )
}

export function DashboardPage() {
    const { user } = useAuth()
    const firstName = user?.name?.split(' ')[0] ?? ''

    const handleAction = (action: string) => {
        toast.info(`Ação rápida: ${action}`)
    }

    // Adapt records to activities
    const activities = MOCK_RECORDS.slice(0, 10).map(r => ({
        id: r.id,
        action: r.acao || 'Desconhecido',
        description: `${r.nome_paciente} - ${r.clinica}`,
        timestamp: r.created_at,
        status: r.status || undefined
    }))

    return (
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

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column: KPIs and Charts */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* KPI Grid */}
                    <StaggeredList delayMs={150} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                            { title: 'Total de Registros', value: MOCK_KPIS.total_registros, icon: Database, variation: MOCK_KPIS.variacao_percentual },
                            { title: 'Clínicas Ativas', value: MOCK_KPIS.clinicas_ativas, icon: Building2, variation: 8.3 },
                            { title: 'Ações no Período', value: MOCK_KPIS.acoes_periodo, icon: Activity, variation: -3.2 },
                            { title: 'Taxa de Confirmação', value: 87, icon: TrendingUp, variation: 5.1, format: 'raw' as const },
                        ].map((kpi) => (
                            <KPICard key={kpi.title} {...kpi} />
                        ))}
                    </StaggeredList>

                    {/* Charts */}
                    <FadeIn delayMs={300}>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Bar chart — Recharts */}
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

                            {/* Distribution — Horizontal bars */}
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

                {/* Right Column: Activity Feed */}
                <div className="col-span-12 lg:col-span-4">
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
    )
}
