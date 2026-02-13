import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, BarChart3, Shield, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/utils/constants'
import { FadeIn } from '@/components/ui/Animations'

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
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-roxo-400) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                }} />

                {/* Glow orbs — brand gradient split */}
                <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-roxo-600/10 blur-[100px]" />
                <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full blur-[80px]" style={{ background: 'rgba(194, 24, 91, 0.06)' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-16">
                    <FadeIn>
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-glow-roxo" style={{ background: 'var(--gradient-brand)' }}>
                            C
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
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-roxo-600/10">
                                        <feat.icon size={18} className="text-roxo-400" />
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
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-glow-roxo" style={{ background: 'var(--gradient-brand)' }}>
                            C
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
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-grafite-200">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="seu@email.com"
                                className={`w-full rounded-lg border bg-grafite-800 px-4 py-2.5 text-sm text-grafite-100 placeholder-grafite-500 outline-none transition-colors focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30 ${errors.email ? 'border-danger-500' : 'border-grafite-700'
                                    }`}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-danger-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-grafite-200">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••"
                                    className={`w-full rounded-lg border bg-grafite-800 px-4 py-2.5 pr-10 text-sm text-grafite-100 placeholder-grafite-500 outline-none transition-colors focus:border-roxo-500 focus:ring-1 focus:ring-roxo-500/30 ${errors.password ? 'border-danger-500' : 'border-grafite-700'
                                        }`}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grafite-400 hover:text-grafite-200 transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-danger-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-press flex w-full items-center justify-center gap-2 rounded-lg bg-roxo-600 py-2.5 text-sm font-semibold text-white shadow-glow-roxo transition-all hover:bg-roxo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Entrar
                                </>
                            )}
                        </button>
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
