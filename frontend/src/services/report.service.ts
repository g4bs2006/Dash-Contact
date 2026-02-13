import api from './api'
import type { ReportConsolidated, KPIData, ExportParams } from '@/types/report.types'

export const reportService = {
    getConsolidated: (params?: Record<string, string>) =>
        api.get<ReportConsolidated>('/reports/consolidated', { params }).then((r) => r.data),

    getKPIs: (params?: Record<string, string>) =>
        api.get<KPIData>('/reports/kpis', { params }).then((r) => r.data),

    export: (params: ExportParams) =>
        api.get('/reports/export', {
            params,
            responseType: 'blob',
        }).then((r) => {
            const url = window.URL.createObjectURL(new Blob([r.data]))
            const link = document.createElement('a')
            link.href = url
            link.download = `relatorio_${Date.now()}.${params.formato}`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }),
}
