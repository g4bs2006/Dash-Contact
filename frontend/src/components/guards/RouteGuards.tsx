import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

export function ProtectedRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-grafite-950">
                <LoadingSpinner size={32} text="Carregando..." />
            </div>
        )
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
    const { isAdmin, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-grafite-950">
                <LoadingSpinner size={32} />
            </div>
        )
    }

    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
