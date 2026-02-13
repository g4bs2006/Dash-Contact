import { useFilters } from '@/hooks/useFilters'
import { MOCK_FILTER_OPTIONS } from '@/mocks/data'
import { Filter, X, Calendar } from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'

export function GlobalFilters() {
    const {
        clinica,
        unidade,
        acao,
        dataInicio,
        dataFim,
        setFilter,
        clearFilters,
    } = useFilters()

    const activeCount = [clinica, unidade, acao, dataInicio, dataFim].filter(Boolean).length

    // Cascading logic: filter units based on selected clinic
    const availableUnits = clinica
        ? MOCK_FILTER_OPTIONS.unidades.filter((u) => u.clinica === clinica)
        : []

    const inputStyle = {
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-default)',
        color: 'var(--text-primary)',
    }

    return (
        <FadeIn>
            <div
                className="mb-6 rounded-xl border p-4 shadow-sm"
                style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-roxo-400" />
                        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Filtros</h3>
                        {activeCount > 0 && (
                            <span className="rounded-full bg-roxo-500/10 px-2 py-0.5 text-xs font-bold text-roxo-400">
                                {activeCount}
                            </span>
                        )}
                    </div>
                    {activeCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-xs transition-colors hover:text-danger-400"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <X size={14} />
                            Limpar filtros
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Clínica */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Clínica</label>
                        <select
                            value={clinica || ''}
                            onChange={(e) => {
                                setFilter('clinica', e.target.value || null)
                                setFilter('unidade', null) // Reset unit when clinic changes
                            }}
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                            style={inputStyle}
                        >
                            <option value="">Todas as clínicas</option>
                            {MOCK_FILTER_OPTIONS.clinicas.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unidade (Disabled if no clinic selected) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Unidade</label>
                        <select
                            value={unidade || ''}
                            onChange={(e) => setFilter('unidade', e.target.value || null)}
                            disabled={!clinica}
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={inputStyle}
                        >
                            <option value="">
                                {clinica ? 'Todas as unidades' : 'Selecione uma clínica'}
                            </option>
                            {availableUnits.map((u) => (
                                <option key={u.value} value={u.value}>{u.value}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ação */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Ação</label>
                        <select
                            value={acao || ''}
                            onChange={(e) => setFilter('acao', e.target.value || null)}
                            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                            style={inputStyle}
                        >
                            <option value="">Todas as ações</option>
                            {MOCK_FILTER_OPTIONS.acoes.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {/* Período (Start Date) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>A partir de</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="date"
                                value={dataInicio || ''}
                                onChange={(e) => setFilter('dataInicio', e.target.value || null)}
                                className="w-full rounded-lg border px-3 py-2 pl-9 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30" // added padding-left for icon
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    )
}
