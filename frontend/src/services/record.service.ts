import api from './api'
import type { Record, RecordFilters, FilterOptions } from '@/types/record.types'
import type { PaginatedResponse } from '@/types/common.types'

export const recordService = {
    list: (filters: RecordFilters) =>
        api.get<PaginatedResponse<Record>>('/records', { params: filters }).then((r) => r.data),

    getById: (id: number) =>
        api.get<Record>(`/records/${id}`).then((r) => r.data),

    getFilterOptions: () =>
        api.get<FilterOptions>('/records/filter-options').then((r) => r.data),
}
