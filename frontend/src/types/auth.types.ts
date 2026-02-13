export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'funcionario'
    status: 'ativo' | 'inativo'
    last_login_at: string | null
    created_at: string
    updated_at: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    user: User
}
