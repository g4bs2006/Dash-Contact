import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, containerClassName, id, ...props }, ref) => {
        const inputId = id || props.name

        return (
            <div className={cn("space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {label}
                    </label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grafite-400 pointer-events-none transition-colors group-focus-within:text-coral-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all duration-200",
                            "bg-surface-base border-border-subtle text-text-primary placeholder:text-text-faint",
                            "focus:border-coral-500 focus:bg-surface-primary focus:ring-2 focus:ring-coral-500/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            leftIcon && "pl-9",
                            rightIcon && "pr-9",
                            error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grafite-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-danger-400 animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input }
