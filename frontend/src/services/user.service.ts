import api from './api'
import type { UserProfile, UserCreate, UserUpdate } from '@/types/user.types'
import type { PaginatedResponse } from '@/types/common.types'

export const userService = {
    list: (params?: Record<string, string>) =>
        api.get<PaginatedResponse<UserProfile>>('/users', { params }).then((r) => r.data),

    getById: (id: string) =>
        api.get<UserProfile>(`/users/${id}`).then((r) => r.data),

    create: (data: UserCreate) =>
        api.post<UserProfile>('/users', data).then((r) => r.data),

    update: (id: string, data: UserUpdate) =>
        api.put<UserProfile>(`/users/${id}`, data).then((r) => r.data),

    toggleStatus: (id: string, status: 'ativo' | 'inativo') =>
        api.patch<UserProfile>(`/users/${id}/status`, { status }).then((r) => r.data),
}
