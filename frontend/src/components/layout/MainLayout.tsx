import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/ui/CommandPalette'

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--surface-base)' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content area — offset by sidebar width */}
            <main
                className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}
            >
                <Outlet />
            </main>

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
