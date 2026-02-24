import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { ProtectedRoute, AdminRoute } from '@/components/guards/RouteGuards'
import { MainLayout } from '@/components/layout/MainLayout'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ClientListPage } from '@/pages/clients/ClientListPage'
import { UserListPage } from '@/pages/users/UserListPage'
import { RecordListPage } from '@/pages/records/RecordListPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { AuditPage } from '@/pages/audit/AuditPage'

export function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Authenticated */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<MainLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/records" element={<RecordListPage />} />
                                <Route path="/reports" element={<ReportsPage />} />

                                {/* Admin only */}
                                <Route element={<AdminRoute />}>
                                    <Route path="/clients" element={<ClientListPage />} />
                                    <Route path="/users" element={<UserListPage />} />
                                    <Route path="/audit" element={<AuditPage />} />
                                </Route>
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    )
}
