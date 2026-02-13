import { Header } from '@/components/layout/Header'
import { KPICard } from '@/components/charts/KPICard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StaggeredList, FadeIn } from '@/components/ui/Animations'
import { Database, Building2, Activity, TrendingUp } from 'lucide-react'
import { MOCK_KPIS, MOCK_RECORDS } from '@/mocks/data'
import { formatDateTime } from '@/utils/formatters'
import { useAuth } from '@/hooks/useAuth'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Cell,
} from 'recharts'

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
    { name: 'Clínica Saúde Plena', value: 560, fill: '#8b5cf6' },
    { name: 'OdontoVita', value: 311, fill: '#a78bfa' },
    { name: 'Clínica Renovar', value: 224, fill: '#6d35c4' },
    { name: 'Bem Estar', value: 150, fill: '#c4b5fd' },
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
            <p className="font-medium">{label}</p>
            <p className="text-roxo-400">{payload[0].value} registros</p>
        </div>
    )
}

export function DashboardPage() {
    const { user } = useAuth()
    const recentRecords = MOCK_RECORDS.slice(0, 5)
    const firstName = user?.name?.split(' ')[0] ?? ''

    return (
        <>
            <Header title="Dashboard" subtitle="Visão geral do sistema" />

            <div className="space-y-6 p-6">
                {/* Greeting */}
                <FadeIn>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {getGreeting()}, <span className="text-gradient">{firstName}</span> 👋
                        </h2>
                        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                            Aqui está o resumo do seu sistema hoje.
                        </p>
                    </div>
                </FadeIn>

                {/* KPI Grid */}
                <StaggeredList delayMs={80} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <FadeIn delayMs={350}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Bar chart — Recharts */}
                        <div
                            className="card-lift rounded-xl border p-5"
                            style={{
                                background: 'var(--surface-primary)',
                                borderColor: 'var(--border-default)',
                            }}
                        >
                            <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Registros por Período
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={CHART_DATA} barSize={20}>
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
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {CHART_DATA.map((_, i) => {
                                            const shades = ['#6d35c4', '#8b5cf6', '#a78bfa', '#5425a0']
                                            return <Cell key={i} fill={shades[i % shades.length]} />
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Distribution — Horizontal bars */}
                        <div
                            className="card-lift rounded-xl border p-5"
                            style={{
                                background: 'var(--surface-primary)',
                                borderColor: 'var(--border-default)',
                            }}
                        >
                            <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Distribuição por Clínica
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={DISTRIBUTION_DATA} layout="vertical" barSize={16}>
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
                                        width={100}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }} />
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

                {/* Recent records */}
                <FadeIn delayMs={500}>
                    <div
                        className="rounded-xl border"
                        style={{
                            background: 'var(--surface-primary)',
                            borderColor: 'var(--border-default)',
                        }}
                    >
                        <div
                            className="flex items-center justify-between px-5 py-4"
                            style={{ borderBottom: '1px solid var(--border-default)' }}
                        >
                            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Registros Recentes</h3>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Últimos 5</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <th className="px-5 py-3">Paciente</th>
                                        <th className="px-5 py-3">Clínica</th>
                                        <th className="px-5 py-3">Ação</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRecords.map((r) => (
                                        <tr key={r.id} className="row-active" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{r.nome_paciente}</td>
                                            <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{r.clinica}</td>
                                            <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{r.acao}</td>
                                            <td className="px-5 py-3"><StatusBadge status={r.sttus} /></td>
                                            <td className="px-5 py-3" style={{ color: 'var(--text-faint)' }}>{formatDateTime(r.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </>
    )
}
