import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { Prompt } from './types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { StatusBadge } from '@/components/shared/status-badge';

export function getPromptsTableConfig(
  data: Prompt[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      { key: 'title', header: 'Prompt Name', render: (row) => <span className="font-medium text-neutral-800">{(row as unknown as Prompt).title}</span> },
      { key: 'category', header: 'Category', render: (row) => <Badge variant="info">{(row as unknown as Prompt).category}</Badge> },
      { key: 'content', header: 'Used By', render: (row) => {
        const preview = (row as unknown as Prompt).content.slice(0, 60);
        return <span className="text-xs text-neutral-400">{preview}...</span>;
      }},
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={(row as unknown as Prompt).status} /> },
      { key: 'updatedAt', header: 'Last Updated', render: (row) => formatDate((row as unknown as Prompt).updatedAt) },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowActions: () => [],
    selectable: true,
    rowKey: 'id',
  };
}
