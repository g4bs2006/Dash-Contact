import { PageTitle } from '@/components/layout/PageTitle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StaggeredList, FadeIn } from '@/components/ui/Animations'
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MOCK_USERS } from '@/mocks/data'
import { formatDateTime } from '@/utils/formatters'
import { useState } from 'react'
import { toast } from 'sonner'
import { SlidePanel } from '@/components/ui/SlidePanel'
import { UserFormPage } from '@/pages/users/UserFormPage'

export function UserListPage() {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    return (
        <div className="w-full animation-fade-in relative z-10 mt-8">
            <div className="p-6">
                <FadeIn>
                    <PageTitle
                        title="Usuários"
                        subtitle={`${MOCK_USERS.length} usuários no sistema`}
                        actions={
                            <Button
                                onClick={() => {
                                    setSelectedUserId(null)
                                    setIsPanelOpen(true)
                                }}
                                leftIcon={<Plus size={16} />}
                            >
                                Novo Usuário
                            </Button>
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
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 transition-colors ${activeMenuId === user.id ? 'bg-coral-500/10 text-coral-400' : 'text-text-faint hover:text-white hover:bg-surface-raised'}`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setActiveMenuId(activeMenuId === user.id ? null : user.id)
                                        }}
                                    >
                                        <MoreVertical size={16} />
                                    </Button>

                                    {activeMenuId === user.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActiveMenuId(null)}
                                            />
                                            <div
                                                className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-md shadow-card ring-1 ring-border-default backdrop-blur-md"
                                                style={{ background: 'rgba(5, 5, 8, 0.8)' }}
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedUserId(user.id)
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
                                                            toast.error(`Excluindo ${user.name}`)
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

            {/* Slide Panel for Form */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={selectedUserId ? 'Editar Usuário' : 'Novo Usuário'}
                width="lg"
            >
                <UserFormPage
                    userId={selectedUserId}
                    onSuccess={() => setIsPanelOpen(false)}
                    asPanel
                />
            </SlidePanel>
        </div>
    )
}
