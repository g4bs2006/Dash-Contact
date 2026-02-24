import { Bell, Search } from 'lucide-react'

export function Header() {
    return (
        <header
            className="sticky top-4 z-30 mx-6 flex h-14 items-center justify-between rounded-xl border px-6 transition-all shadow-card"
            style={{
                background: 'rgba(5, 5, 8, 0.6)', // Abyssal Vault com transparência
                backdropFilter: 'blur(16px)',
                borderColor: 'var(--border-default)',
            }}
        >
            {/* Esquerda: Buscar */}
            <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="btn-press flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors"
                style={{
                    background: 'var(--surface-raised)',
                    color: 'var(--text-muted)',
                }}
            >
                <Search size={14} />
                <span className="hidden sm:inline">Buscar...</span>
                <kbd className="rounded px-1 py-0.5 text-[10px] font-mono" style={{ background: 'var(--surface-overlay)' }}>Ctrl+K</kbd>
            </button>

            {/* Direita: Notificações */}
            <div className="flex items-center gap-4">
                <button
                    className="btn-press relative rounded-lg p-2 transition-colors hover:bg-metal-500/10 hover:text-metal-300"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <Bell size={18} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-metal-500 shadow-neon" />
                </button>
            </div>
        </header>
    )
}
