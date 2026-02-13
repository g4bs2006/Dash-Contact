import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FadeIn } from '@/components/ui/Animations'
import { MOCK_RECORDS, MOCK_FILTER_OPTIONS } from '@/mocks/data'
import { formatDateTime, formatPhone } from '@/utils/formatters'
import { useState } from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'

export function RecordListPage() {
    const [search, setSearch] = useState('')
    const [showFilters, setShowFilters] = useState(true)
    const [filterClinica, setFilterClinica] = useState('')
    const [filterAcao, setFilterAcao] = useState('')

    const filtered = MOCK_RECORDS.filter((r) => {
        const matchSearch =
            !search ||
            r.nome_paciente?.toLowerCase().includes(search.toLowerCase()) ||
            r.detalhes?.toLowerCase().includes(search.toLowerCase())
        const matchClinica = !filterClinica || r.clinica === filterClinica
        const matchAcao = !filterAcao || r.acao === filterAcao
        return matchSearch && matchClinica && matchAcao
    })

    const inputStyle = {
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-default)',
        color: 'var(--text-primary)',
    }

    return (
        <>
            <Header title="Registros" subtitle="Consulta de registros existentes" />

            <div className="p-6 space-y-4">
                {/* Filter bar */}
                <FadeIn>
                    <div
                        className="rounded-xl border p-4"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="btn-press flex items-center gap-2 text-sm font-medium"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <Filter size={16} className="text-roxo-400" />
                                Filtros
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                                    style={{ color: 'var(--text-muted)' }}
                                />
                            </button>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{filtered.length} registros</span>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Buscar paciente..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                    />
                                </div>
                                <select
                                    value={filterClinica}
                                    onChange={(e) => setFilterClinica(e.target.value)}
                                    className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500"
                                    style={inputStyle}
                                >
                                    <option value="">Todas as clínicas</option>
                                    {MOCK_FILTER_OPTIONS.clinicas.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterAcao}
                                    onChange={(e) => setFilterAcao(e.target.value)}
                                    className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500"
                                    style={inputStyle}
                                >
                                    <option value="">Todas as ações</option>
                                    {MOCK_FILTER_OPTIONS.acoes.map((a) => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Table */}
                <FadeIn delayMs={200}>
                    <div
                        className="overflow-hidden rounded-xl border"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    className="text-left text-xs font-medium uppercase tracking-wider"
                                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
                                >
                                    <th className="px-5 py-3">#</th>
                                    <th className="px-5 py-3">Paciente</th>
                                    <th className="px-5 py-3">Telefone</th>
                                    <th className="px-5 py-3">Clínica</th>
                                    <th className="px-5 py-3">Ação</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Detalhes</th>
                                    <th className="px-5 py-3">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="row-active cursor-pointer"
                                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                    >
                                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{r.id}</td>
                                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{r.nome_paciente}</td>
                                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{formatPhone(r.telefone_paciente)}</td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{r.clinica}</td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{r.acao}</td>
                                        <td className="px-5 py-3"><StatusBadge status={r.sttus} /></td>
                                        <td className="px-5 py-3 text-xs max-w-[200px] truncate" style={{ color: 'var(--text-faint)' }}>{r.detalhes}</td>
                                        <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{formatDateTime(r.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            </div>
        </>
    )
}
