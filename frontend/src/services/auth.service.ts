import api from './api'
import type { LoginRequest, LoginResponse, User } from '@/types/auth.types'

export const authService = {
    login: (data: LoginRequest) =>
        api.post<LoginResponse>('/auth/login', data).then((r) => r.data),

    logout: () =>
        api.post('/auth/logout').then((r) => r.data),

    me: () =>
        api.get<User>('/auth/me').then((r) => r.data),
}
