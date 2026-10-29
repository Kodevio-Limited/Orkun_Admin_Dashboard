'use client';

import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function DataTableToolbar({
  searchPlaceholder = 'Search...',
  onSearch,
  filters,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-neutral-200">
      <div className="flex items-center gap-3 flex-1">
        {onSearch && (
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-neutral-200 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        )}
        {filters}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
