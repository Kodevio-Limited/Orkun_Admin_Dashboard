import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { SystemLog } from './types';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui';

const levelVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  info: 'default',
  warning: 'warning',
  error: 'danger',
};

export function getLogsTableConfig(
  data: SystemLog[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      { key: 'timestamp', header: 'Time', render: (row) => formatDateTime((row as unknown as SystemLog).timestamp) },
      { key: 'level', header: 'Level', render: (row) => {
        const l = row as unknown as SystemLog;
        return <Badge variant={levelVariant[l.level]}>{l.level.toUpperCase()}</Badge>;
      }},
      { key: 'user', header: 'User' },
      { key: 'action', header: 'Action', render: (row) => <span className="capitalize">{(row as unknown as SystemLog).action}</span> },
      { key: 'entity', header: 'Entity' },
      { key: 'description', header: 'Description', className: 'max-w-md truncate' },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowKey: 'id',
  };
}
