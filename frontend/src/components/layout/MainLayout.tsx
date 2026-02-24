import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useState, useEffect } from 'react'

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    useEffect(() => {
        // Simple Theme Observer for Body Class
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark')
                    setTheme(isDark ? 'dark' : 'light')
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })

        // Initial check
        setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

        return () => observer.disconnect()
    }, [])

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--surface-base)' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content area */}
            <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'ml-[5.5rem]' : 'ml-[17.5rem]'} overflow-x-hidden relative`}>
                <Header />
                <main className="flex-1 p-6 lg:p-8 w-full mx-auto relative z-10">
                    <Outlet />
                </main>
            </div>

            {/* Command Palette */}
            <CommandPalette />

            {/* Theme-Aware Toast notifications */}
            <Toaster
                position="bottom-right"
                theme={theme}
                toastOptions={{
                    classNames: {
                        toast: 'group toast border backdrop-blur-md shadow-card rounded-xl border-border-default',
                        title: 'text-text-primary font-medium text-sm',
                        description: 'text-text-secondary text-xs',
                        actionButton: 'bg-coral-500 text-white',
                        cancelButton: 'bg-surface-raised text-text-muted',
                        success: '!bg-green-500/10 !border-green-500/30 !text-green-400',
                        error: '!bg-red-500/10 !border-red-500/30 !text-red-400',
                        warning: '!bg-yellow-500/10 !border-yellow-500/30 !text-yellow-400',
                        info: '!bg-blue-500/10 !border-blue-500/30 !text-blue-400',
                    },
                    style: {
                        background: 'var(--surface-raised)',
                        color: 'var(--text-secondary)',
                    }
                }}
            />
        </div>
    )
}
