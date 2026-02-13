import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { EmptyState } from '@/components/feedback/EmptyState'

interface DataTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    isLoading?: boolean
    pagination?: {
        page: number
        perPage: number
        total: number
    }
    onPageChange?: (page: number) => void
    onRowClick?: (row: T) => void
    emptyMessage?: string
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    pagination,
    onPageChange,
    onRowClick,
    emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const totalPages = pagination ? Math.ceil(pagination.total / pagination.perPage) : 0

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border-default)', background: 'var(--surface-raised)' }}>
                <LoadingSpinner text="Carregando dados..." />
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="rounded-xl border border-dashed" style={{ borderColor: 'var(--border-default)', background: 'var(--surface-raised)' }}>
                <EmptyState title={emptyMessage} />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-default)', background: 'var(--surface-primary)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-default)' }}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer hover:text-roxo-400' : ''}`}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <ArrowUpDown size={14} className="opacity-50" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y" style={{ divideColor: 'var(--border-subtle)' }}>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-roxo-500/5' : ''}`}
                                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Página <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{pagination.page}</span> de{' '}
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(1)}
                            disabled={pagination.page === 1}
                            className="rounded p-1 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--text-muted)' }}
                            title="Primeira página"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="rounded p-1 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--text-muted)' }}
                            title="Página anterior"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page === totalPages}
                            className="rounded p-1 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--text-muted)' }}
                            title="Próxima página"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(totalPages)}
                            disabled={pagination.page === totalPages}
                            className="rounded p-1 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--text-muted)' }}
                            title="Última página"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
