import { PageTitle } from '@/components/layout/PageTitle'
import { DataTable } from '@/components/tables/DataTable'
import { FadeIn } from '@/components/ui/Animations'
import { createColumnHelper } from '@tanstack/react-table'
import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageTransition } from '@/components/ui/PageTransition'

interface AuditLog {
    id: string
    created_at: string
    user_name: string
    action: string
    entity: string
    entity_id: string
    ip_address: string
    status: 'success' | 'failure'
}

const MOCK_AUDIT: AuditLog[] = [
    { id: '1', created_at: '2026-02-13 14:30', user_name: 'Gabriel Admin', action: 'Login', entity: 'Auth', entity_id: '-', ip_address: '192.168.1.10', status: 'success' },
    { id: '2', created_at: '2026-02-13 14:15', user_name: 'Gabriel Admin', action: 'Create', entity: 'User', entity_id: '45', ip_address: '192.168.1.10', status: 'success' },
    { id: '3', created_at: '2026-02-13 10:00', user_name: 'Ana Souza', action: 'Update', entity: 'Client', entity_id: '12', ip_address: '10.0.0.5', status: 'success' },
    { id: '4', created_at: '2026-02-12 18:45', user_name: 'System', action: 'Backup', entity: 'Database', entity_id: '-', ip_address: 'localhost', status: 'success' },
    { id: '5', created_at: '2026-02-12 09:20', user_name: 'Pedro Lima', action: 'Delete', entity: 'Record', entity_id: '889', ip_address: '10.0.0.8', status: 'failure' },
    { id: '6', created_at: '2026-02-12 09:15', user_name: 'Pedro Lima', action: 'Login', entity: 'Auth', entity_id: '-', ip_address: '10.0.0.8', status: 'success' },
]

const columnHelper = createColumnHelper<AuditLog>()

export function AuditPage() {
    const [search, setSearch] = useState('')

    const columns = [
        columnHelper.accessor('created_at', {
            header: 'Data/Hora',
            cell: (info) => <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{String(info.getValue())}</span>,
        }),
        columnHelper.accessor('user_name', {
            header: 'Usuário',
            cell: (info) => <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('action', {
            header: 'Ação',
            cell: (info) => (
                <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${info.getValue() === 'Delete' ? 'bg-danger-500/10 text-danger-400' :
                        info.getValue() === 'Create' ? 'bg-success-500/10 text-success-400' :
                            'bg-metal-500/10 text-metal-400'
                        }`}
                >
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('entity', {
            header: 'Entidade',
            cell: (info) => <span style={{ color: 'var(--text-secondary)' }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('ip_address', {
            header: 'IP',
            cell: (info) => <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{info.getValue()}</span>,
        }),
    ]

    const filtered = MOCK_AUDIT.filter(
        (log) =>
            log.user_name.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.entity.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <PageTransition>
            <PageTitle
                title="Auditoria"
                subtitle="Registro de atividades do sistema"
            />

            <div className="p-6">
                <FadeIn>
                    <div
                        className="rounded-xl border p-6"
                        style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <div className="relative w-full sm:max-w-xs">
                                <Input
                                    placeholder="Buscar logs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<Search size={14} />}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    leftIcon={<Filter size={16} />}
                                >
                                    Filtros Avançados
                                </Button>
                            </div>
                        </div>

                        <DataTable
                            data={filtered}
                            columns={columns as any}
                            pagination={{ page: 1, perPage: 10, total: filtered.length }}
                            emptyMessage="Nenhum log encontrado"
                        />
                    </div>
                </FadeIn>
            </div>
        </PageTransition>
    )
}
