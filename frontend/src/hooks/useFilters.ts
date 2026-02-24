import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
    clinica: string | null
    unidade: string | null
    acao: string | null
    dataInicio: string | null
    dataFim: string | null
    search: string | null
    setFilter: (key: string, value: string | null) => void
    clearFilters: () => void
    toQueryParams: () => Record<string, string>
}

export const useFilters = create<FilterState>()(
    persist(
        (set, get) => ({
            clinica: null,
            unidade: null,
            acao: null,
            dataInicio: null,
            dataFim: null,
            search: null,

            setFilter: (key, value) => set({ [key]: value }),

            clearFilters: () =>
                set({
                    clinica: null,
                    unidade: null,
                    acao: null,
                    dataInicio: null,
                    dataFim: null,
                    search: null,
                }),

            toQueryParams: () => {
                const state = get()
                const params: Record<string, string> = {}
                if (state.clinica) params.clinica = state.clinica
                if (state.unidade) params.unidade = state.unidade
                if (state.acao) params.acao = state.acao
                if (state.dataInicio) params.data_inicio = state.dataInicio
                if (state.dataFim) params.data_fim = state.dataFim
                if (state.search) params.search = state.search
                return params
            },
        }),
        { name: 'contact-ia-filters' }
    )
)
