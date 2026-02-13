import { Header } from '@/components/layout/Header'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MOCK_CLIENTS, MOCK_RECORDS } from '@/mocks/data'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FadeIn } from '@/components/ui/Animations'
import { ArrowLeft, Edit, Building2, Phone, Mail, FileText, Ban, CheckCircle } from 'lucide-react'
import { formatDateTime, formatPhone, formatDate } from '@/utils/formatters'
import { DataTable } from '@/components/tables/DataTable'
import { toast } from 'sonner'
import { createColumnHelper } from '@tanstack/react-table'
import type { Record } from '@/types/record.types'

const columnHelper = createColumnHelper<Record>()

export function ClientDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const client = MOCK_CLIENTS.find((c) => c.id === id)

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <p className="text-grafite-400">Cliente não encontrado</p>
                <button
                    onClick={() => navigate('/clients')}
                    className="mt-4 text-roxo-400 hover:underline"
                >
                    Voltar para lista
                </button>
            </div>
        )
    }

    const clientRecords = MOCK_RECORDS.filter((r) => r.clinica === client.clinica)

    const columns = [
        columnHelper.accessor('id', {
            header: '#',
            cell: (info) => <span style={{ fontFamily: 'monospace', color: 'var(--text-faint)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('acao', {
            header: 'Ação',
            cell: (info) => <span style={{ color: 'var(--text-primary)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('nome_paciente', {
            header: 'Paciente',
            cell: (info) => <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{info.getValue()}</span>,
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

    const handleStatusToggle = () => {
        // Mock toggle
        toast.success(`Cliente ${client.status === 'ativo' ? 'inativado' : 'ativado'} com sucesso`)
        // In real app, would refetch data
    }

    return (
        <>
            <Header
                title={client.clinica}
                subtitle={`Detalhes da unidade ${client.unidade}`}
            />

            <div className="p-6">
                <FadeIn>
                    <button
                        onClick={() => navigate('/clients')}
                        className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-roxo-400"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <ArrowLeft size={16} />
                        Voltar para lista
                    </button>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column: Client Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div
                                className="rounded-xl border p-6"
                                style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-roxo-500/10 text-roxo-400">
                                        <Building2 size={24} />
                                    </div>
                                    <StatusBadge status={client.status} size="md" />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Responsável</p>
                                        <p className="mt-1 font-medium" style={{ color: 'var(--text-primary)' }}>{client.responsavel || '—'}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contato</p>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-primary)' }}>{formatPhone(client.telefone)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-primary)' }}>{client.email || '—'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Cadastro</p>
                                        <p className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>{formatDate(client.created_at)}</p>
                                    </div>

                                    {client.observacoes && (
                                        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Observações</p>
                                            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>"{client.observacoes}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    <Link
                                        to={`/clients/${client.id}/edit`}
                                        className="btn-press flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors hover:bg-roxo-500/10 text-roxo-400 border border-roxo-500/20"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={handleStatusToggle}
                                        className={`btn-press flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors border ${client.status === 'ativo'
                                                ? 'hover:bg-danger-500/10 text-danger-400 border-danger-500/20'
                                                : 'hover:bg-success-500/10 text-success-400 border-success-500/20'
                                            }`}
                                    >
                                        {client.status === 'ativo' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                        {client.status === 'ativo' ? 'Inativar' : 'Ativar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Related Records */}
                        <div className="lg:col-span-2">
                            <div
                                className="rounded-xl border p-6 min-h-[500px]"
                                style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <FileText size={20} className="text-roxo-400" />
                                        <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Registros Recentes</h3>
                                    </div>
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{clientRecords.length} encontrados</span>
                                </div>

                                <DataTable
                                    data={clientRecords}
                                    columns={columns}
                                    onRowClick={(row) => navigate(`/records/${row.id}`)}
                                    emptyMessage="Nenhum registro encontrado para este cliente"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </>
    )
}
