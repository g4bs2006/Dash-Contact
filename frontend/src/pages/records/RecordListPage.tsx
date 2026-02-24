import { PageTitle } from '@/components/layout/PageTitle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MOCK_RECORDS } from '@/mocks/data'
import { formatDateTime } from '@/utils/formatters'
import { useState } from 'react'
import { Filter, Plus } from 'lucide-react'
import { GlobalFilters } from '@/components/filters/GlobalFilters'
import { useFilters } from '@/hooks/useFilters'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidePanel } from '@/components/ui/SlidePanel'
import { RecordDetailPage } from '@/pages/records/RecordDetailPage'

export function RecordListPage() {
    const [showFilters, setShowFilters] = useState(true)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
    const { clinica, acao, search, dataInicio, dataFim } = useFilters()

    const filtered = MOCK_RECORDS.filter((r) => {
        const matchSearch =
            !search ||
            r.nome_paciente?.toLowerCase().includes(search.toLowerCase()) ||
            r.detalhes?.toLowerCase().includes(search.toLowerCase())

        const matchClinica = !clinica || r.clinica === clinica
        const matchAcao = !acao || r.acao === acao

        // Date filtering (simplistic string comparison for mock data)
        const recordDate = new Date(r.created_at).getTime()
        const matchDataInicio = !dataInicio || recordDate >= new Date(dataInicio).getTime()
        const matchDataFim = !dataFim || recordDate <= new Date(dataFim + 'T23:59:59').getTime()

        return matchSearch && matchClinica && matchAcao && matchDataInicio && matchDataFim
    })

    return (
        <div className="w-full animation-fade-in relative z-10 mt-8">
            <div className="p-6 space-y-4">
                <PageTitle
                    title="Atendimentos"
                    subtitle="Histórico de interações registradas."
                />

                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        leftIcon={<Filter size={16} />}
                        className={showFilters ? 'bg-coral-500/10 text-coral-400' : ''}
                    >
                        Filtros
                    </Button>

                    <Button
                        onClick={() => {
                            setSelectedRecordId(null)
                            setIsPanelOpen(true)
                        }}
                        leftIcon={<Plus size={16} />}
                    >
                        Novo Atendimento
                    </Button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <GlobalFilters />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    className="rounded-xl border shadow-sm overflow-hidden"
                    style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                >
                    {filtered.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    className="text-left text-xs font-medium uppercase tracking-wider"
                                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
                                >
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Data</th>
                                    <th className="px-6 py-3">Clínica</th>
                                    <th className="px-6 py-3">Paciente</th>
                                    <th className="px-6 py-3">Ação</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {filtered.map((record) => (
                                    <tr
                                        key={record.id}
                                        onClick={() => {
                                            setSelectedRecordId(String(record.id))
                                            setIsPanelOpen(true)
                                        }}
                                        className="transition-colors hover:bg-[var(--surface-raised)] cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-[var(--text-faint)]">
                                            #{record.id}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                                            {formatDateTime(record.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                                            {record.clinica}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                                            {record.nome_paciente}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-[var(--surface-raised)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-default)]">
                                                {record.acao}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={record.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            title="Nenhum registro encontrado"
                            description="Tente ajustar os filtros para encontrar o que você procura."
                            action={
                                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                                    Ajustar Filtros
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Slide Panel for Records */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={selectedRecordId ? 'Detalhes do Atendimento' : 'Novo Atendimento'}
                width="xl"
            >
                <RecordDetailPage
                    recordId={selectedRecordId}
                    asPanel
                />
            </SlidePanel>
        </div>
    )
}
