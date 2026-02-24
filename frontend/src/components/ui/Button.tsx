import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
    fullWidth?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-metal-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon"

        const variants = {
            primary: "text-white shadow-[0_4px_16px_rgba(232,42,113,0.3)] hover:brightness-110 border-none",
            secondary: "bg-surface-raised text-text-primary hover:bg-surface-overlay border border-border-default",
            outline: "border border-border-subtle bg-transparent text-text-secondary hover:border-metal-500/50 hover:text-metal-400 focus-visible:ring-metal-500",
            ghost: "text-text-muted hover:bg-surface-raised hover:text-text-primary",
            danger: "bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 hover:text-danger-400 border border-transparent",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base",
            icon: "h-10 w-10 p-0",
        }

        const widthClass = fullWidth ? "w-full" : ""

        return (
            <button
                ref={ref}
                className={cn("btn-press", baseStyles, variants[variant], sizes[size], widthClass, className)}
                style={variant === 'primary' ? { background: 'var(--gradient-brand)' } : undefined}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        )
    }
)

Button.displayName = "Button"

export { Button }
