import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, BarChart3, Shield, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/utils/constants'
import { FadeIn } from '@/components/ui/Animations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            setError(null)
            await login(data.email, data.password)
            navigate('/dashboard', { replace: true })
        } catch {
            setError('E-mail ou senha inválidos.')
        }
    }

    return (
        <div className="flex min-h-screen bg-grafite-950">
            {/* ── Left panel: Branding ── */}
            <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
                {/* Background layers */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1e0a3a 0%, #0a0a0f 50%, #1a0a1a 100%)' }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-coral-400) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                    opacity: 0.1,
                }} />

                {/* Glow orbs — brand gradient split */}
                <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-coral-600/10 blur-[100px]" />
                <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full blur-[80px]" style={{ background: 'rgba(194, 24, 91, 0.06)' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-16">
                    <FadeIn>
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-[var(--color-surface)] shadow-glow" style={{ background: 'var(--gradient-brand)' }}>
                            DC
                        </div>
                    </FadeIn>

                    <FadeIn delayMs={100}>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gradient">
                            {APP_NAME}
                        </h1>
                    </FadeIn>

                    <FadeIn delayMs={200}>
                        <p className="mt-3 max-w-md text-lg text-grafite-400">
                            Sistema inteligente de gestão de contatos e automação para clínicas.
                        </p>
                    </FadeIn>

                    <FadeIn delayMs={400}>
                        <div className="mt-12 space-y-5">
                            {[
                                { icon: BarChart3, label: 'Dashboard analítico', desc: 'Visão consolidada de KPIs e métricas' },
                                { icon: Zap, label: 'Automação n8n', desc: 'Lembretes e confirmações automáticas' },
                                { icon: Shield, label: 'Auditoria completa', desc: 'Rastreabilidade de todas as ações' },
                            ].map((feat) => (
                                <div key={feat.label} className="flex items-start gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral-600/10">
                                        <feat.icon size={18} className="text-coral-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-grafite-200">{feat.label}</p>
                                        <p className="text-xs text-grafite-500">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                {/* Footer */}
                <div className="relative z-10 px-16 pb-8">
                    <p className="text-xs text-grafite-600">
                        © 2026 contact.IA — Todos os direitos reservados
                    </p>
                </div>
            </div>

            {/* ── Right panel: Login form ── */}
            <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
                <FadeIn delayMs={150} className="w-full max-w-sm">
                    {/* Mobile-only logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-[var(--color-surface)] shadow-glow" style={{ background: 'var(--gradient-brand)' }}>
                            DC
                        </div>
                        <h1 className="text-xl font-bold text-grafite-50">{APP_NAME}</h1>
                    </div>

                    {/* Title */}
                    <div className="mb-6 hidden lg:block">
                        <h2 className="text-2xl font-bold text-grafite-50">Acessar conta</h2>
                        <p className="mt-1 text-sm text-grafite-400">Entre com suas credenciais para continuar</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-400">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <Input
                            id="email"
                            type="email"
                            label="E-mail"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                            className="bg-grafite-800"
                        />

                        {/* Password */}
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Senha"
                            placeholder="••••••"
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register('password')}
                            className="bg-grafite-800"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-grafite-400 hover:text-grafite-200 transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-full bg-[var(--color-coral-500)] hover:bg-[var(--color-coral-400)] text-[var(--color-surface)] shadow-glow"
                            leftIcon={<LogIn size={16} />}
                        >
                            Entrar
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-grafite-800"></div>
                            <span className="shrink-0 px-4 text-xs text-grafite-500">ou Teste Rápido</span>
                            <div className="flex-grow border-t border-grafite-800"></div>
                        </div>

                        {/* Admin Test Hook */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-metal-500/30 text-metal-300 hover:bg-metal-500/10 transition-colors"
                            onClick={async () => {
                                try {
                                    setError(null)
                                    await login('admin@contactia.com', '123456')
                                    navigate('/dashboard', { replace: true })
                                } catch {
                                    setError('Erro ao entrar como admin de teste.')
                                }
                            }}
                        >
                            <Shield size={16} className="mr-2" />
                            Entrar como Administrador
                        </Button>
                    </form>

                    {/* Mobile footer */}
                    <p className="mt-8 text-center text-xs text-grafite-600 lg:hidden">
                        © 2026 contact.IA
                    </p>
                </FadeIn>
            </div >
        </div >
    )
}
