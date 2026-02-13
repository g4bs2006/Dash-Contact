import { Header } from '@/components/layout/Header'
import { PageTitle } from '@/components/layout/PageTitle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StaggeredList, FadeIn } from '@/components/ui/Animations'
import { Plus, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_USERS } from '@/mocks/data'
import { formatDateTime } from '@/utils/formatters'

export function UserListPage() {
    return (
        <>
            <Header title="Usuários" subtitle="Gerenciamento de acessos" />
            <div className="p-6">
                <FadeIn>
                    <PageTitle
                        title="Usuários"
                        subtitle={`${MOCK_USERS.length} usuários no sistema`}
                        actions={
                            <Link
                                to="/users/new"
                                className="btn-press flex items-center gap-2 rounded-lg bg-roxo-600 px-4 py-2 text-sm font-medium text-white shadow-glow-roxo transition-colors hover:bg-roxo-500"
                            >
                                <Plus size={16} />
                                Novo Usuário
                            </Link>
                        }
                    />
                </FadeIn>

                <StaggeredList delayMs={100} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MOCK_USERS.map((user) => (
                        <div
                            key={user.id}
                            className="card-lift rounded-xl border p-5"
                            style={{
                                background: 'var(--surface-primary)',
                                borderColor: 'var(--border-default)',
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: 'var(--gradient-brand)' }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    className="btn-press rounded p-1 transition-colors"
                                    style={{ color: 'var(--text-muted)' }}
                                    aria-label="Ações"
                                >
                                    <MoreVertical size={14} />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <StatusBadge status={user.role} />
                                <StatusBadge status={user.status} />
                            </div>

                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                                    Último login: {user.last_login_at ? formatDateTime(user.last_login_at) : 'Nunca'}
                                </p>
                            </div>
                        </div>
                    ))}
                </StaggeredList>
            </div>
        </>
    )
}
