import { useState, useCallback } from 'react'

interface UsePaginationOptions {
    initialPage?: number
    initialPerPage?: number
}

export function usePagination({ initialPage = 1, initialPerPage = 20 }: UsePaginationOptions = {}) {
    const [page, setPage] = useState(initialPage)
    const [perPage, setPerPage] = useState(initialPerPage)

    const goToPage = useCallback((p: number) => {
        setPage(Math.max(1, p))
    }, [])

    const nextPage = useCallback(() => {
        setPage((p) => p + 1)
    }, [])

    const prevPage = useCallback(() => {
        setPage((p) => Math.max(1, p - 1))
    }, [])

    const changePerPage = useCallback((newPerPage: number) => {
        setPerPage(newPerPage)
        setPage(1)
    }, [])

    const reset = useCallback(() => {
        setPage(initialPage)
        setPerPage(initialPerPage)
    }, [initialPage, initialPerPage])

    return {
        page,
        perPage,
        goToPage,
        nextPage,
        prevPage,
        changePerPage,
        reset,
    }
}
