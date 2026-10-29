import { ReactNode } from 'react';

export interface ColumnDef {
  key: string;
  header: string;
  render?: (row: Record<string, unknown>) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableConfig {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  rowActions?: (row: Record<string, unknown>) => { label: string; onClick: () => void; variant?: 'default' | 'danger' }[];
  onRowClick?: (row: Record<string, unknown>) => void;
  emptyState?: ReactNode;
  toolbar?: {
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    filters?: ReactNode;
    actions?: ReactNode;
  };
  selectable?: boolean;
  onSelectionChange?: (selected: string[]) => void;
  rowKey?: string;
}
