import { Header } from '@/components/layout/Header'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { MOCK_CLIENTS } from '@/mocks/data'
import { FadeIn } from '@/components/ui/Animations'

const clientSchema = z.object({
    clinica: z.string().min(1, 'Nome da clínica é obrigatório'),
    unidade: z.string().min(1, 'Nome da unidade é obrigatório'),
    responsavel: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    observacoes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export function ClientFormPage() {
    const { id } = useParams()
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
        navigate('/clients')
    }

    const inputStyle = {
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-default)',
        color: 'var(--text-primary)',
    }

    const labelStyle = { color: 'var(--text-secondary)' }

    return (
        <>
            <Header
                title={isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
                subtitle={isEditMode ? 'Atualize os dados do cliente' : 'Cadastre um novo cliente no sistema'}
            />

            <div className="mx-auto max-w-2xl p-6">
                <FadeIn>
                    <button
                        onClick={() => navigate('/clients')}
                        className="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-roxo-400"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <ArrowLeft size={16} />
                        Voltar para lista
                    </button>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div
                            className="rounded-xl border p-6 shadow-sm"
                            style={{ background: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
                        >
                            <h3 className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Dados Cadastrais</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Clínica *</label>
                                    <input
                                        {...register('clinica')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="Ex: Clínica Saúde Plena"
                                    />
                                    {errors.clinica && <p className="text-xs text-danger-400">{errors.clinica.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Unidade *</label>
                                    <input
                                        {...register('unidade')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="Ex: Matriz - Centro"
                                    />
                                    {errors.unidade && <p className="text-xs text-danger-400">{errors.unidade.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Responsável</label>
                                    <input
                                        {...register('responsavel')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="Nome do contato principal"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Telefone</label>
                                    <input
                                        {...register('telefone')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Email</label>
                                    <input
                                        {...register('email')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="contato@clinica.com"
                                    />
                                    {errors.email && <p className="text-xs text-danger-400">{errors.email.message}</p>}
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Observações</label>
                                    <textarea
                                        {...register('observacoes')}
                                        rows={3}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="Informações adicionais..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/clients')}
                                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-grafite-800"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-lg bg-roxo-600 px-4 py-2 text-sm font-medium text-white shadow-glow-roxo transition-all hover:bg-roxo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isEditMode ? 'Salvar Alterações' : 'Criar Cliente'}
                            </button>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </>
    )
}
