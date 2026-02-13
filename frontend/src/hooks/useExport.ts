import { useCallback, useState } from 'react'
import { reportService } from '@/services/report.service'
import type { ExportParams } from '@/types/report.types'

export function useExport() {
    const [isExporting, setIsExporting] = useState(false)

    const exportReport = useCallback(async (params: ExportParams) => {
        setIsExporting(true)
        try {
            await reportService.export(params)
        } finally {
            setIsExporting(false)
        }
    }, [])

    return { isExporting, exportReport }
}
