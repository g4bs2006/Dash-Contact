import { PageTitle } from '@/components/layout/PageTitle'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { KPICard } from '@/components/charts/KPICard'
import { DataTable } from '@/components/tables/DataTable'
import { MOCK_KPIS, MOCK_RECORDS } from '@/mocks/data'
import { FadeIn, StaggeredList } from '@/components/ui/Animations'
import { FileDown, Download, Database, Users, Activity, TrendingUp, PieChart as PieChartIcon } from 'lucide-react'
import { useExport } from '@/hooks/useExport'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { createColumnHelper } from '@tanstack/react-table'
import type { Record } from '@/types/record.types'
import { formatDateTime } from '@/utils/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'


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

    const columns: any[] = [
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
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor('created_at', {
            header: 'Data',
            cell: (info) => <span style={{ color: 'var(--text-faint)' }}>{formatDateTime(info.getValue())}</span>,
        }),
    ]

    return (
        <div className="w-full animation-fade-in relative z-10 mt-8">
            <div className="p-6 space-y-6">
                <PageTitle
                    title="Dashboard"
                    subtitle="Visão em Tempo Real dos Resultados"
                />

                <GlobalFilters />

                {/* Bento KPIs Grid */}
                <StaggeredList delayMs={100} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Featured KPI Box - Takes up more space */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col justify-end">
                        <KPICard
                            title="Total Registros"
                            value={MOCK_KPIS.total_registros}
                            icon={Database}
                            variation={12.5}
                        />
                    </div>
                    {/* Regular Boxes */}
                    <div className="col-span-2 lg:col-span-1">
                        <KPICard title="Clínicas Ativas" value={MOCK_KPIS.clinicas_ativas} icon={Users} variation={0} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <KPICard title="Total de Ações" value={MOCK_KPIS.acoes_periodo} icon={Activity} variation={-2.3} />
                    </div>
                    <div className="col-span-2 lg:col-span-2">
                        <KPICard title="Taxa Conversão" value={68} icon={TrendingUp} variation={5.4} format="raw" />
                    </div>
                </StaggeredList>

                {/* Charts Grid - Bento Style */}
                <FadeIn delayMs={200}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Trend Chart - 2/3 width */}
                        <div
                            className="rounded-xl border p-6 lg:col-span-2 flex flex-col"
                            style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Tendência Semanal</h3>
                                    <p className="text-xs text-grafite-400 mt-1">Volume de ações e registros diários</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-coral-500/10 flex items-center justify-center text-coral-500">
                                    <Activity size={16} />
                                </div>
                            </div>
                            <div className="flex-1 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
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
                                            cursor={{ stroke: 'var(--color-coral-400)', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="var(--color-coral-500)"
                                            strokeWidth={3}
                                            dot={{ fill: 'var(--surface-primary)', stroke: 'var(--color-coral-500)', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, fill: 'var(--color-coral-400)' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribution Chart - 1/3 width */}
                        <div
                            className="rounded-xl border p-6 flex flex-col"
                            style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                        >
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Distribuição</h3>
                                        <p className="text-xs text-grafite-400 mt-1">Ações por tipo</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-roxo-500/10 flex items-center justify-center text-roxo-500">
                                        <PieChartIcon size={16} />
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => exportReport({ formato: 'csv', tipo: 'consolidado' })}
                                        disabled={isExporting}
                                        leftIcon={<FileDown size={14} />}
                                    >
                                        CSV
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => exportReport({ formato: 'pdf', tipo: 'consolidado' })}
                                        disabled={isExporting}
                                        leftIcon={<Download size={14} />}
                                    >
                                        PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
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
        </div>
    )
}
