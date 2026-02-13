import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types/auth.types'
import { MOCK_ADMIN, MOCK_CREDENTIALS } from '@/mocks/data'

interface AuthContextType {
    user: User | null
    isAdmin: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Mock: check if user was previously logged in
        const token = localStorage.getItem('access_token')
        if (token === 'mock-jwt-token') {
            setUser(MOCK_ADMIN)
        }
        setIsLoading(false)
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        // Mock: simulate API delay
        await new Promise((r) => setTimeout(r, 800))

        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
            localStorage.setItem('access_token', 'mock-jwt-token')
            setUser(MOCK_ADMIN)
        } else {
            throw new Error('Credenciais inválidas')
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('access_token')
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin: user?.role === 'admin',
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
