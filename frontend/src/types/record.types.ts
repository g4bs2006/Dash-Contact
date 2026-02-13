export interface Record {
    id: number
    created_at: string
    clinica: string | null
    unidade: string | null
    acao: string | null
    sttus: string | null
    nome_paciente: string | null
    telefone_paciente: string | null
    detalhes: string | null
}

export interface RecordFilters {
    clinica?: string
    unidade?: string
    acao?: string
    periodo?: 'semana' | 'mes' | 'ano'
    data_inicio?: string
    data_fim?: string
    busca?: string
    page?: number
    per_page?: number
    order_by?: string
    order_dir?: 'asc' | 'desc'
}

export interface FilterOptions {
    clinicas: string[]
    unidades: { value: string; clinica: string }[]
    acoes: string[]
}
