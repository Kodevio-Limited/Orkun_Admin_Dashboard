'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTableConfig } from './data-table.types';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Checkbox } from '@/components/ui';
import { MoreHorizontal } from 'lucide-react';
import { Dropdown } from '@/components/ui/dropdown';

export function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  rowActions,
  onRowClick,
  emptyState,
  toolbar,
  selectable,
  onSelectionChange,
  rowKey,
}: DataTableConfig) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
      onSelectionChange?.([]);
    } else {
      const keys = data.map((row) => String(row[rowKey || 'id']));
      setSelected(keys);
      onSelectionChange?.(keys);
    }
  };

  const handleSelect = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    setSelected(next);
    onSelectionChange?.(next);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="p-8 text-center text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {(toolbar?.onSearch || toolbar?.filters || toolbar?.actions) && (
        <DataTableToolbar {...toolbar} />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selected.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              {(rowActions || onRowClick) && (
                <th className="w-12 px-4 py-3" />
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12"
                >
                  {emptyState || (
                    <div className="text-center text-neutral-400">No data found</div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={String(row[rowKey || 'id'] ?? i)}
                  className={cn(
                    'border-b border-neutral-100 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-neutral-50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(String(row[rowKey || 'id']))}
                        onChange={() => handleSelect(String(row[rowKey || 'id']))}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-sm text-neutral-700', col.className)}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        align="right"
                        trigger={
                          <button className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        }
                        items={rowActions(row)}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <DataTablePagination {...pagination} />
      )}
    </div>
  );
}
