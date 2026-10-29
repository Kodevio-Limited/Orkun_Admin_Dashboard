import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { Template } from './types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { StatusBadge } from '@/components/shared/status-badge';
import { ImageIcon } from 'lucide-react';

const themeColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  Birthday: 'warning', Christmas: 'success', Halloween: 'danger', Summer: 'warning',
  Winter: 'info', School: 'default', Graduation: 'info', Family: 'default', Newborn: 'info',
};

export function getTemplatesTableConfig(
  data: Template[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      {
        key: 'background',
        header: 'Preview',
        render: (row) => {
          const bg = (row as unknown as Template).background;
          return bg ? (
            <img src={bg} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
              <ImageIcon size={18} className="text-neutral-300" />
            </div>
          );
        },
      },
      { key: 'name', header: 'Template Name', render: (row) => <span className="font-medium text-neutral-800">{(row as unknown as Template).name}</span> },
      { key: 'category', header: 'Category' },
      {
        key: 'theme',
        header: 'Theme',
        render: (row) => <Badge variant={themeColors[(row as unknown as Template).theme] || 'default'}>{(row as unknown as Template).theme}</Badge>,
      },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={(row as unknown as Template).status} /> },
      { key: 'createdAt', header: 'Created', render: (row) => formatDate((row as unknown as Template).createdAt) },
      { key: 'updatedAt', header: 'Updated', render: (row) => formatDate((row as unknown as Template).updatedAt) },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowActions: () => [],
    selectable: true,
    rowKey: 'id',
  };
}
