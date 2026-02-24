import { PageTitle } from '@/components/layout/PageTitle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FadeIn } from '@/components/ui/Animations'
import { Building2, Plus, Search, MoreVertical, Edit, Trash2, FileText } from 'lucide-react'
import { MOCK_CLIENTS } from '@/mocks/data'
import { formatDate, formatPhone } from '@/utils/formatters'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SlidePanel } from '@/components/ui/SlidePanel'
import { ClientFormPage } from '@/pages/clients/ClientFormPage'
import { ClientDetailPage } from '@/pages/clients/ClientDetailPage'
import { toast } from 'sonner'


export function ClientListPage() {
    const [search, setSearch] = useState('')
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

    const filtered = MOCK_CLIENTS.filter(
        (c) =>
            c.clinica.toLowerCase().includes(search.toLowerCase()) ||
            c.unidade.toLowerCase().includes(search.toLowerCase()) ||
            (c.responsavel || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="w-full animation-fade-in relative z-10 mt-8">
            <div className="p-6">
                <FadeIn>
                    <PageTitle
                        title="Clientes"
                        subtitle={`${MOCK_CLIENTS.length} clientes cadastrados`}
                        actions={
                            <Button
                                onClick={() => {
                                    setSelectedClientId(null)
                                    setIsPanelOpen(true)
                                }}
                                leftIcon={<Plus size={16} />}
                            >
                                Novo Cliente
                            </Button>
                        }
                    />
                </FadeIn>

                {/* Search */}
                <FadeIn delayMs={100}>
                    <div className="mt-4 max-w-md">
                        <Input
                            placeholder="Buscar por clínica, unidade ou responsável..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search size={16} />}
                        />
                    </div>
                </FadeIn>

                {/* Table */}
                <FadeIn delayMs={200}>
                    <div
                        className="mt-6 overflow-hidden rounded-xl border"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card-val)' }}
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
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral-500/10 text-xs font-bold text-coral-400">
                                                    <Building2 size={14} />
                                                </div>
                                                <span className="font-bold tracking-tight text-white">{client.clinica}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{client.unidade}</td>
                                        <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{client.responsavel ?? '—'}</td>
                                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{formatPhone(client.telefone)}</td>
                                        <td className="px-5 py-3"><StatusBadge status={client.status} /></td>
                                        <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(client.created_at)}</td>
                                        <td className="px-5 py-3">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveMenuId(activeMenuId === client.id ? null : client.id)
                                                    }}
                                                    className={`rounded p-1 transition-colors ${activeMenuId === client.id ? 'bg-coral-500/10 text-coral-400' : 'text-text-faint hover:text-white hover:bg-surface-raised'}`}
                                                    aria-label="Ações"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {activeMenuId === client.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setActiveMenuId(null)}
                                                        />
                                                        <div
                                                            className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-md border shadow-lg ring-1 ring-black/5"
                                                            style={{ background: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSelectedClientId(client.id)
                                                                        setIsDetailPanelOpen(true)
                                                                        setActiveMenuId(null)
                                                                    }}
                                                                    className="flex w-full items-center px-4 py-2 text-xs transition-colors hover:bg-[var(--surface-primary)] hover:text-coral-400"
                                                                    style={{ color: 'var(--text-primary)' }}
                                                                >
                                                                    <FileText size={12} className="mr-2" />
                                                                    Detalhes
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSelectedClientId(client.id)
                                                                        setIsPanelOpen(true)
                                                                        setActiveMenuId(null)
                                                                    }}
                                                                    className="flex w-full items-center px-4 py-2 text-xs transition-colors hover:bg-[var(--surface-primary)] hover:text-coral-400"
                                                                    style={{ color: 'var(--text-primary)' }}
                                                                >
                                                                    <Edit size={12} className="mr-2" />
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toast.error(`Excluindo ${client.clinica}`)
                                                                        setActiveMenuId(null)
                                                                    }}
                                                                    className="flex w-full items-center px-4 py-2 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 size={12} className="mr-2" />
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            </div>

            {/* Slide Panel for Form */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={selectedClientId ? 'Editar Cliente' : 'Novo Cliente'}
                width="lg"
            >
                {/* 
                  Passing ID to Form. If null, it's creation mode. 
                  Also bypassing default Form's full page layout using a prop or rendering just its internal logic.
                */}
                <ClientFormPage
                    clientId={selectedClientId}
                    onSuccess={() => setIsPanelOpen(false)}
                    asPanel
                />
            </SlidePanel>

            {/* Slide Panel for Detail */}
            <SlidePanel
                isOpen={isDetailPanelOpen}
                onClose={() => setIsDetailPanelOpen(false)}
                title="Detalhes do Cliente"
                width="xl"
            >
                <ClientDetailPage
                    clientId={selectedClientId}
                    asPanel
                />
            </SlidePanel>
        </div>
    )
}
