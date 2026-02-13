import { Header } from '@/components/layout/Header'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_RECORDS } from '@/mocks/data'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FadeIn } from '@/components/ui/Animations'
import { ArrowLeft, User, Phone, Calendar, Building2, MessageSquare, Info } from 'lucide-react'
import { formatDateTime, formatPhone } from '@/utils/formatters'

export function RecordDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const record = MOCK_RECORDS.find((r) => String(r.id) === id)

    if (!record) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <p className="text-grafite-400">Registro não encontrado</p>
                <button
                    onClick={() => navigate('/records')}
                    className="mt-4 text-roxo-400 hover:underline"
                >
                    Voltar para lista
                </button>
            </div>
        )
    }

    const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | null }) => (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                <Icon size={14} />
                <span>{label}</span>
            </div>
            <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>{value || '—'}</p>
        </div>
    )

    return (
        <>
            <Header title={`Registro #${record.id}`} subtitle="Detalhes da interação" />

            <div className="mx-auto max-w-3xl p-6">
                <FadeIn>
                    <button
                        onClick={() => navigate('/records')}
                        className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-roxo-400"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <ArrowLeft size={16} />
                        Voltar para lista
                    </button>

                    <div
                        className="rounded-xl border shadow-lg overflow-hidden"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        {/* Card Header */}
                        <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)', background: 'var(--surface-raised)' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {record.acao}
                                    </h2>
                                    <p className="mt-1 flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                        <Calendar size={14} />
                                        Criado em {formatDateTime(record.created_at)}
                                    </p>
                                </div>
                                <StatusBadge status={record.sttus} size="md" />
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-roxo-400">Paciente</h3>
                                    <div className="space-y-6">
                                        <DetailItem icon={User} label="Nome" value={record.nome_paciente} />
                                        <DetailItem icon={Phone} label="Telefone" value={formatPhone(record.telefone_paciente)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-roxo-400">Origem</h3>
                                    <div className="space-y-6">
                                        <DetailItem icon={Building2} label="Clínica" value={record.clinica} />
                                        <DetailItem icon={Info} label="Unidade" value={record.unidade} />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-roxo-400">Detalhes</h3>
                                <div className="flex gap-3 items-start p-4 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
                                    <MessageSquare size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                    <p style={{ color: 'var(--text-secondary)' }}>{record.detalhes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </>
    )
}
