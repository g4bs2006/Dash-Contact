import { Header } from '@/components/layout/Header'
import { PageTitle } from '@/components/layout/PageTitle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FadeIn } from '@/components/ui/Animations'
import { Building2, Plus, Search, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_CLIENTS } from '@/mocks/data'
import { formatDate, formatPhone } from '@/utils/formatters'
import { useState } from 'react'

export function ClientListPage() {
    const [search, setSearch] = useState('')

    const filtered = MOCK_CLIENTS.filter(
        (c) =>
            c.clinica.toLowerCase().includes(search.toLowerCase()) ||
            c.unidade.toLowerCase().includes(search.toLowerCase()) ||
            c.responsavel?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <Header title="Clientes" subtitle="Gerenciamento de clínicas e unidades" />

            <div className="p-6">
                <FadeIn>
                    <PageTitle
                        title="Clientes"
                        subtitle={`${MOCK_CLIENTS.length} clientes cadastrados`}
                        actions={
                            <Link
                                to="/clients/new"
                                className="btn-press flex items-center gap-2 rounded-lg bg-roxo-600 px-4 py-2 text-sm font-medium text-white shadow-glow-roxo transition-colors hover:bg-roxo-500"
                            >
                                <Plus size={16} />
                                Novo Cliente
                            </Link>
                        }
                    />
                </FadeIn>

                {/* Search */}
                <FadeIn delayMs={100}>
                    <div className="relative mt-4 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar por clínica, unidade ou responsável..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                            style={{
                                background: 'var(--surface-raised)',
                                borderColor: 'var(--border-default)',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>
                </FadeIn>

                {/* Table */}
                <FadeIn delayMs={200}>
                    <div
                        className="mt-6 overflow-hidden rounded-xl border"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    className="text-left text-xs font-medium uppercase tracking-wider"
                                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
                                >
                                    <th className="px-5 py-3">Clínica</th>
                                    <th className="px-5 py-3">Unidade</th>
                                    <th className="px-5 py-3">Responsável</th>
                                    <th className="px-5 py-3">Telefone</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Cadastro</th>
                                    <th className="px-5 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="row-active"
                                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-roxo-600/10 text-xs font-bold text-roxo-400">
                                                    <Building2 size={14} />
                                                </div>
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{client.clinica}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{client.unidade}</td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{client.responsavel ?? '—'}</td>
                                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{formatPhone(client.telefone)}</td>
                                        <td className="px-5 py-3"><StatusBadge status={client.status} /></td>
                                        <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(client.created_at)}</td>
                                        <td className="px-5 py-3">
                                            <button
                                                className="btn-press rounded p-1 transition-colors"
                                                style={{ color: 'var(--text-muted)' }}
                                                aria-label="Ações"
                                            >
                                                <MoreVertical size={14} />
                                            </button>
                                        </td>
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
