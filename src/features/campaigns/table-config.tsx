import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { Campaign } from './types';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';

const typeLabels: Record<string, string> = {
  display: 'Display',
  video: 'Video',
  social: 'Social',
  search: 'Search',
};

export function getCampaignTableConfig(
  data: Campaign[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      {
        key: 'name',
        header: 'Campaign',
        render: (row) => {
          const c = row as unknown as Campaign;
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-medium shrink-0 overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{c.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-neutral-800">{c.name}</p>
                <p className="text-xs text-neutral-400">Created {formatDate(c.createdAt)}</p>
              </div>
            </div>
          );
        },
      },
      { key: 'type', header: 'Type', render: (row) => <Badge variant="default">{typeLabels[(row as unknown as Campaign).type]}</Badge> },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={(row as unknown as Campaign).status} /> },
      { key: 'budget', header: 'Budget', render: (row) => formatCurrency((row as unknown as Campaign).budget) },
      { key: 'spent', header: 'Spent', render: (row) => formatCurrency((row as unknown as Campaign).spent) },
      { key: 'impressions', header: 'Impressions', render: (row) => (row as unknown as Campaign).impressions.toLocaleString() },
      { key: 'clicks', header: 'Clicks', render: (row) => (row as unknown as Campaign).clicks.toLocaleString() },
      { key: 'conversions', header: 'Conv.', render: (row) => (row as unknown as Campaign).conversions.toLocaleString() },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowActions: () => [],
    selectable: true,
    rowKey: 'id',
  };
}
