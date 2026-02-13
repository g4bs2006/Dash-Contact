import { Header } from '@/components/layout/Header'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Save, ArrowLeft, Loader2, Shield, User } from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'
import { useState } from 'react'

const userSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['admin', 'funcionario']),
})

type UserFormData = z.infer<typeof userSchema>

export function UserFormPage() {
    const navigate = useNavigate()
    const [passwordStrength, setPasswordStrength] = useState(0)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: 'funcionario',
        },
    })

    // Watch password for strength meter
    const password = watch('password')
    if (password !== undefined) {
        // Simple strength calc
        let score = 0
        if (password.length > 5) score += 1
        if (password.length > 8) score += 1
        if (/[A-Z]/.test(password)) score += 1
        if (/[0-9]/.test(password)) score += 1
        if (score !== passwordStrength) setPasswordStrength(score)
    }

    const onSubmit = async (data: UserFormData) => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log('User created:', data)
        toast.success('Usuário criado com sucesso!')
        navigate('/users')
    }

    const inputStyle = {
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-default)',
        color: 'var(--text-primary)',
    }

    const labelStyle = { color: 'var(--text-secondary)' }

    return (
        <>
            <Header title="Novo Usuário" subtitle="Adicionar acesso ao sistema" />

            <div className="mx-auto max-w-2xl p-6">
                <FadeIn>
                    <button
                        onClick={() => navigate('/users')}
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
                            <h3 className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Dados de Acesso</h3>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Nome Completo *</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grafite-400" />
                                        <input
                                            {...register('name')}
                                            className="w-full rounded-lg border px-3 py-2 pl-9 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                            style={inputStyle}
                                            placeholder="Ex: João Silva"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-danger-400">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Email *</label>
                                    <input
                                        {...register('email')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="email@empresa.com"
                                    />
                                    {errors.email && <p className="text-xs text-danger-400">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Senha *</label>
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30"
                                        style={inputStyle}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    {/* Password Strength Meter */}
                                    {password && (
                                        <div className="mt-2 flex gap-1 h-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= i
                                                            ? i <= 2 ? 'bg-warning-400' : 'bg-success-400'
                                                            : 'bg-grafite-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {errors.password && <p className="text-xs text-danger-400">{errors.password.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium" style={labelStyle}>Nível de Acesso *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${watch('role') === 'funcionario'
                                                    ? 'border-roxo-500 bg-roxo-500/5'
                                                    : 'border-transparent bg-grafite-800' // hardcoded fallback for unselected state, better to use vars
                                                }`}
                                            style={{
                                                background: watch('role') === 'funcionario' ? 'rgba(139, 92, 246, 0.05)' : 'var(--surface-raised)',
                                                borderColor: watch('role') === 'funcionario' ? 'var(--color-roxo-500)' : 'var(--border-default)'
                                            }}
                                        >
                                            <input type="radio" value="funcionario" {...register('role')} className="hidden" />
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grafite-700">
                                                <User size={16} className="text-grafite-300" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Funcionário</span>
                                                <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Acesso limitado</span>
                                            </div>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${watch('role') === 'admin'
                                                    ? 'border-roxo-500 bg-roxo-500/5'
                                                    : 'border-transparent bg-grafite-800'
                                                }`}
                                            style={{
                                                background: watch('role') === 'admin' ? 'rgba(139, 92, 246, 0.05)' : 'var(--surface-raised)',
                                                borderColor: watch('role') === 'admin' ? 'var(--color-roxo-500)' : 'var(--border-default)'
                                            }}
                                        >
                                            <input type="radio" value="admin" {...register('role')} className="hidden" />
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-roxo-500/20">
                                                <Shield size={16} className="text-roxo-400" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Administrador</span>
                                                <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Acesso total</span>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.role && <p className="text-xs text-danger-400">{errors.role.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/users')}
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
                                Criar Usuário
                            </button>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </>
    )
}
