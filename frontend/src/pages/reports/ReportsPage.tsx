import { Header } from '@/components/layout/Header'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { KPICard } from '@/components/charts/KPICard'
import { DataTable } from '@/components/tables/DataTable'
import { MOCK_KPIS, MOCK_RECORDS } from '@/mocks/data'
import { FadeIn, StaggeredList } from '@/components/ui/Animations'
import { FileDown, Download, Database, Users, Activity, TrendingUp } from 'lucide-react'
import { useExport } from '@/hooks/useExport'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { createColumnHelper } from '@tanstack/react-table'
import type { Record } from '@/types/record.types'
import { formatDateTime } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'

const columnHelper = createColumnHelper<Record>()

export function ReportsPage() {
    const { isExporting, exportReport } = useExport()

    // Mock chart data
    const trendData = [
        { name: 'Seg', total: 12 },
        { name: 'Ter', total: 19 },
        { name: 'Qua', total: 15 },
        { name: 'Qui', total: 22 },
        { name: 'Sex', total: 30 },
        { name: 'Sáb', total: 18 },
        { name: 'Dom', total: 10 },
    ]

    const distributionData = [
        { name: 'Agendamento', value: 45, color: '#8b5cf6' },
        { name: 'Confirmação', value: 30, color: '#a78bfa' },
        { name: 'Cancelamento', value: 15, color: '#f87171' },
        { name: 'Lembrete', value: 10, color: '#60a5fa' },
    ]

    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: (info) => <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('clinica', {
            header: 'Clínica',
            cell: (info) => <span style={{ color: 'var(--text-primary)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('acao', {
            header: 'Ação',
            cell: (info) => <span style={{ color: 'var(--text-muted)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('sttus', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor('created_at', {
            header: 'Data',
            cell: (info) => <span style={{ color: 'var(--text-faint)' }}>{formatDateTime(info.getValue())}</span>,
        }),
    ]

    return (
        <>
            <Header title="Relatórios" subtitle="Análise consolidada do sistema" />

            <div className="p-6 space-y-6">
                <GlobalFilters />

                {/* KPIs */}
                <StaggeredList delayMs={100} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { title: 'Total Registros', value: MOCK_KPIS.total_registros, icon: Database, variation: 12.5 },
                        { title: 'Clínicas Ativas', value: MOCK_KPIS.clinicas_ativas, icon: Users, variation: 0 },
                        { title: 'Ações Totais', value: MOCK_KPIS.acoes_periodo, icon: Activity, variation: -2.3 },
                        { title: 'Conversão', value: 68, icon: TrendingUp, variation: 5.4, format: 'raw' as const },
                    ].map((kpi) => (
                        <KPICard key={kpi.title} {...kpi} />
                    ))}
                </StaggeredList>

                {/* Charts */}
                <FadeIn delayMs={200}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Trend Chart */}
                        <div
                            className="rounded-xl border p-6"
                            style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                        >
                            <h3 className="mb-6 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Tendência Semanal</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--surface-raised)',
                                            borderColor: 'var(--border-default)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '8px'
                                        }}
                                        cursor={{ stroke: 'var(--color-roxo-400)', strokeWidth: 2 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-roxo-500)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--surface-primary)', stroke: 'var(--color-roxo-500)', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: 'var(--color-roxo-400)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Distribution Chart */}
                        <div
                            className="rounded-xl border p-6"
                            style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Distribuição por Ação</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => exportReport({ formato: 'csv', tipo: 'consolidado' })}
                                        disabled={isExporting}
                                        className="btn-press flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-grafite-800"
                                        style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                                    >
                                        <FileDown size={14} />
                                        CSV
                                    </button>
                                    <button
                                        onClick={() => exportReport({ formato: 'pdf', tipo: 'consolidado' })}
                                        disabled={isExporting}
                                        className="btn-press flex items-center gap-2 rounded-lg bg-roxo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-roxo-500 disabled:opacity-50"
                                    >
                                        <Download size={14} />
                                        PDF
                                    </button>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--surface-raised)',
                                            borderColor: 'var(--border-default)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </FadeIn>

                {/* Data Table */}
                <FadeIn delayMs={300}>
                    <div
                        className="rounded-xl border p-6"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Dados Detalhados</h3>
                        <DataTable
                            data={MOCK_RECORDS}
                            columns={columns}
                            pagination={{ page: 1, perPage: 10, total: MOCK_RECORDS.length }}
                        />
                    </div>
                </FadeIn>
            </div>
        </>
    )
}
