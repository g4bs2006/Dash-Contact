export interface UserProfile {
    id: string
    name: string
    email: string
    role: 'admin' | 'funcionario'
    status: 'ativo' | 'inativo'
    last_login_at: string | null
    created_at: string
    updated_at: string
}

export interface UserCreate {
    name: string
    email: string
    password: string
    role?: 'admin' | 'funcionario'
}

export interface UserUpdate {
    name?: string
    email?: string
    role?: 'admin' | 'funcionario'
    status?: 'ativo' | 'inativo'
}
