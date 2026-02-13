import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date: string | null | undefined): string {
    if (!date) return '—'
    const parsed = parseISO(date)
    if (!isValid(parsed)) return '—'
    return format(parsed, 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDateTime(date: string | null | undefined): string {
    if (!date) return '—'
    const parsed = parseISO(date)
    if (!isValid(parsed)) return '—'
    return format(parsed, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

export function formatNumber(value: number): string {
    return value.toLocaleString('pt-BR')
}

export function formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function formatPhone(phone: string | null | undefined): string {
    if (!phone) return '—'
    const clean = phone.replace(/\D/g, '')
    if (clean.length === 11) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
    }
    if (clean.length === 10) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
    }
    return phone
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    return `${str.slice(0, maxLength)}…`
}
