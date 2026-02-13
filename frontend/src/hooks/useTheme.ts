import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
    theme: Theme
    toggle: () => void
    setTheme: (t: Theme) => void
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
}

export const useTheme = create<ThemeState>()(
    persist<ThemeState>(
        (set) => ({
            theme: 'dark',
            toggle: () =>
                set((state) => {
                    const next: Theme = state.theme === 'dark' ? 'light' : 'dark'
                    applyTheme(next)
                    return { theme: next }
                }),
            setTheme: (theme: Theme) => {
                applyTheme(theme)
                set({ theme })
            },
        }),
        {
            name: 'contactia-theme',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

// Apply theme on initial load
const stored = localStorage.getItem('contactia-theme')
if (stored) {
    try {
        const parsed = JSON.parse(stored)
        applyTheme(parsed.state?.theme ?? 'dark')
    } catch {
        applyTheme('dark')
    }
} else {
    applyTheme('dark')
}
