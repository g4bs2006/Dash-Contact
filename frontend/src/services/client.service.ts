import api from './api'
import type { Client, ClientCreate, ClientUpdate } from '@/types/client.types'
import type { PaginatedResponse } from '@/types/common.types'

export const clientService = {
    list: (params?: Record<string, string>) =>
        api.get<PaginatedResponse<Client>>('/clients', { params }).then((r) => r.data),

    getById: (id: string) =>
        api.get<Client>(`/clients/${id}`).then((r) => r.data),

    create: (data: ClientCreate) =>
        api.post<Client>('/clients', data).then((r) => r.data),

    update: (id: string, data: ClientUpdate) =>
        api.put<Client>(`/clients/${id}`, data).then((r) => r.data),

    delete: (id: string) =>
        api.delete(`/clients/${id}`).then((r) => r.data),
}
