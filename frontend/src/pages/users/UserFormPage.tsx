import { PageTitle } from '@/components/layout/PageTitle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Save, ArrowLeft, Shield, User } from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const userSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['admin', 'funcionario']),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormPageProps {
    userId?: string | null
    onSuccess?: () => void
    asPanel?: boolean
}

export function UserFormPage({ userId, onSuccess, asPanel }: UserFormPageProps = {}) {
    const navigate = useNavigate()
    const [passwordStrength, setPasswordStrength] = useState(0)

    // Use watch sparingly to prevent full renders
    const { watch, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: { role: 'funcionario' }
    })

    // Performance fix: Custom change handler instead of watch('password')
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        let score = 0
        if (val.length > 5) score += 1
        if (val.length > 8) score += 1
        if (/[A-Z]/.test(val)) score += 1
        if (/[0-9]/.test(val)) score += 1

        // Debounced or direct state set prevents whole form re-render
        if (score !== passwordStrength) {
            setPasswordStrength(score)
        }
    }

    const { onChange: formHookOnChange, ...passwordRegisterRest } = register('password')

    const onSubmit = async (data: UserFormData) => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log('User created:', data)
        toast.success(userId ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!')

        if (onSuccess) {
            onSuccess()
        } else if (!asPanel) {
            navigate('/users')
        }
    }

    const labelStyle = { color: 'var(--text-secondary)' }

    const content = (
        <FadeIn>
            {!asPanel && (
                <Button
                    variant="ghost"
                    onClick={() => navigate('/users')}
                    className="mb-6 pl-0 hover:bg-transparent hover:text-coral-400"
                    leftIcon={<ArrowLeft size={16} />}
                >
                    Voltar para lista
                </Button>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
                <div
                    className={cn("rounded-xl border shadow-sm", asPanel ? "p-0 border-none shadow-none" : "p-6")}
                    style={!asPanel ? { background: 'var(--surface-primary)', borderColor: 'var(--border-default)' } : {}}
                >
                    {!asPanel && <h3 className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Dados de Acesso</h3>}

                    <div className="space-y-4">
                        <Input
                            label="Nome Completo *"
                            placeholder="Ex: João Silva"
                            leftIcon={<User size={16} />}
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email *"
                            placeholder="email@empresa.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div>
                            <Input
                                type="password"
                                label="Senha *"
                                placeholder="Mínimo 6 caracteres"
                                error={errors.password?.message}
                                {...passwordRegisterRest}
                                onChange={(e) => {
                                    formHookOnChange(e)
                                    handlePasswordChange(e)
                                }}
                            />
                            {/* Password Strength Meter */}
                            {passwordStrength > 0 && (
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
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium" style={labelStyle}>Nível de Acesso *</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${watch('role') === 'funcionario'
                                        ? 'border-coral-500 bg-coral-500/5'
                                        : 'border-transparent bg-[var(--surface-raised)]'
                                        }`}
                                    style={{
                                        background: watch('role') === 'funcionario' ? 'rgba(255, 107, 74, 0.05)' : 'var(--surface-raised)',
                                        borderColor: watch('role') === 'funcionario' ? 'var(--color-coral-500)' : 'var(--border-default)'
                                    }}
                                >
                                    <input type="radio" value="funcionario" {...register('role')} className="hidden" />
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-overlay)]">
                                        <User size={16} style={{ color: 'var(--text-faint)' }} />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Funcionário</span>
                                        <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>Acesso limitado</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${watch('role') === 'admin'
                                        ? 'border-coral-500 bg-coral-500/5'
                                        : 'border-transparent bg-[var(--surface-raised)]'
                                        }`}
                                    style={{
                                        background: watch('role') === 'admin' ? 'rgba(255, 107, 74, 0.05)' : 'var(--surface-raised)',
                                        borderColor: watch('role') === 'admin' ? 'var(--color-coral-500)' : 'var(--border-default)'
                                    }}
                                >
                                    <input type="radio" value="admin" {...register('role')} className="hidden" />
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-500/20">
                                        <Shield size={16} className="text-coral-400" />
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

                <div className="flex justify-end gap-3 pt-6 border-t border-border-default mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onSuccess ? onSuccess() : navigate('/users')}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        leftIcon={<Save size={16} />}
                    >
                        {userId ? 'Salvar Alterações' : 'Criar Usuário'}
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
                <PageTitle title={userId ? 'Editar Usuário' : 'Novo Usuário'} subtitle="Gerenciar acesso ao sistema" />
            )}

            <div className="mx-auto max-w-2xl p-6">
                {content}
            </div>
        </>
    )
}
