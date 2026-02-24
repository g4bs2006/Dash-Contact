import { PageTitle } from '@/components/layout/PageTitle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Save, ArrowLeft } from 'lucide-react'
import { MOCK_CLIENTS } from '@/mocks/data'
import { FadeIn } from '@/components/ui/Animations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const clientSchema = z.object({
    clinica: z.string().min(1, 'Nome da clínica é obrigatório'),
    unidade: z.string().min(1, 'Nome da unidade é obrigatório'),
    responsavel: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    observacoes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormPageProps {
    clientId?: string | null
    onSuccess?: () => void
    asPanel?: boolean
}

export function ClientFormPage({ clientId, onSuccess, asPanel }: ClientFormPageProps = {}) {
    const params = useParams()
    const id = clientId || params.id
    const isEditMode = !!id
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    })

    useEffect(() => {
        if (isEditMode) {
            const client = MOCK_CLIENTS.find((c) => c.id === id)
            if (client) {
                reset({
                    clinica: client.clinica,
                    unidade: client.unidade,
                    responsavel: client.responsavel || '',
                    telefone: client.telefone || '',
                    email: client.email || '',
                    observacoes: client.observacoes || '',
                })
            } else {
                toast.error('Cliente não encontrado')
                navigate('/clients')
            }
        }
    }, [id, isEditMode, reset, navigate])

    const onSubmit = async (data: ClientFormData) => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log('Dados salvos:', data)
        toast.success(isEditMode ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!')

        if (onSuccess) {
            onSuccess()
        } else if (!asPanel) {
            navigate('/clients')
        }
    }

    const inputStyle = {
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-default)',
        color: 'var(--text-primary)',
    }

    const labelStyle = { color: 'var(--text-secondary)' }

    const content = (
        <FadeIn>
            {!asPanel && (
                <button
                    onClick={() => navigate('/clients')}
                    className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-coral-400"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ArrowLeft size={16} />
                    Voltar para lista
                </button>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
                <div
                    className={cn("rounded-xl border shadow-sm", asPanel ? "p-0 border-none shadow-none" : "p-6")}
                    style={!asPanel ? { background: 'var(--surface-primary)', borderColor: 'var(--border-default)' } : {}}
                >
                    {!asPanel && <h3 className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Dados Cadastrais</h3>}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Input
                                label="Clínica *"
                                placeholder="Ex: Clínica Saúde Plena"
                                error={errors.clinica?.message}
                                {...register('clinica')}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Input
                                label="Unidade *"
                                placeholder="Ex: Matriz - Centro"
                                error={errors.unidade?.message}
                                {...register('unidade')}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Input
                                label="Responsável"
                                placeholder="Nome do contato principal"
                                {...register('responsavel')}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Input
                                label="Telefone"
                                placeholder="(00) 00000-0000"
                                {...register('telefone')}
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                            <Input
                                label="Email"
                                placeholder="contato@clinica.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-sm font-medium" style={labelStyle}>Observações</label>
                            <textarea
                                {...register('observacoes')}
                                rows={3}
                                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500/30"
                                style={inputStyle}
                                placeholder="Informações adicionais..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border-default mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onSuccess ? onSuccess() : navigate('/clients')}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        leftIcon={<Save size={16} />}
                    >
                        {isEditMode ? 'Salvar Alterações' : 'Criar Cliente'}
                    </Button>
                </div>
            </form>
        </FadeIn>
    )

    if (asPanel) {
        return content
    }

    return (
        <>
            {!asPanel && (
                <PageTitle
                    title={isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
                    subtitle={isEditMode ? 'Atualize os dados do cliente' : 'Cadastre um novo cliente no sistema'}
                />
            )}

            <div className="mx-auto max-w-2xl p-6">
                {content}
            </div>
        </>
    )
}
