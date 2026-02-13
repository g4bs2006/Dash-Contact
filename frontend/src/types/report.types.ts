export interface ReportConsolidated {
    periodo: {
        inicio: string
        fim: string
    }
    total_registros: number
    por_clinica: ClinicaGroup[]
    serie_temporal: TimeSeriesPoint[]
}

export interface ClinicaGroup {
    clinica: string
    total: number
    por_unidade: UnidadeGroup[]
}

export interface UnidadeGroup {
    unidade: string
    total: number
    por_acao: Record<string, number>
}

export interface TimeSeriesPoint {
    data: string
    total: number
}

export interface KPIData {
    total_registros: number
    clinicas_ativas: number
    acoes_periodo: number
    variacao_percentual: number
}

export interface ExportParams {
    formato: 'csv' | 'pdf'
    tipo: 'consolidado' | 'detalhado'
    clinica?: string
    unidade?: string
    acao?: string
    data_inicio?: string
    data_fim?: string
}
