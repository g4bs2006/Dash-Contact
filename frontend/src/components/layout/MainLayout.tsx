import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)

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

            {/* Toast notifications */}
            <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-secondary)',
                    },
                }}
            />
        </div>
    )
}
