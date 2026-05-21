import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading,
  error,
  emptyMessage = 'No data available',
  onRowClick,
  actions,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-lg flex gap-3">
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 rounded-lg" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <motion.table
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-semibold text-dark-muted">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right text-sm font-semibold text-dark-muted">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={row.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(row)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-dark-text">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  {actions(row)}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  )
}

export default DataTable
