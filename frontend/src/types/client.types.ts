export interface Client {
    id: string
    clinica: string
    unidade: string
    responsavel: string | null
    telefone: string | null
    email: string | null
    status: 'ativo' | 'inativo'
    observacoes: string | null
    created_at: string
    updated_at: string
}

export interface ClientCreate {
    clinica: string
    unidade: string
    responsavel?: string
    telefone?: string
    email?: string
    observacoes?: string
}

export interface ClientUpdate extends Partial<ClientCreate> {
    status?: 'ativo' | 'inativo'
}
