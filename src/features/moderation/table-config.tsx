import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { ScanResult } from './types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { StatusBadge } from '@/components/shared/status-badge';
import { ImageIcon } from 'lucide-react';

const confidenceColor = (score: number): 'success' | 'warning' | 'danger' => {
  if (score >= 0.9) return 'success';
  if (score >= 0.7) return 'warning';
  return 'danger';
};

export function getModerationTableConfig(
  data: ScanResult[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      {
        key: 'thumbnail',
        header: 'Image',
        render: (row) => {
          const thumb = (row as unknown as ScanResult).thumbnail;
          return thumb ? (
            <img src={thumb} alt="" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <ImageIcon size={16} className="text-neutral-300" />
            </div>
          );
        },
      },
      { key: 'userName', header: 'User' },
      { key: 'uploadTime', header: 'Upload Time', render: (row) => formatDate((row as unknown as ScanResult).uploadTime) },
      { key: 'scanResult', header: 'Scan Result', render: (row) => <Badge variant="info">{(row as unknown as ScanResult).scanResult}</Badge> },
      {
        key: 'confidence',
        header: 'Confidence',
        render: (row) => {
          const score = (row as unknown as ScanResult).confidence;
          return <Badge variant={confidenceColor(score)}>{(score * 100).toFixed(0)}%</Badge>;
        },
      },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={(row as unknown as ScanResult).status} /> },
      { key: 'reason', header: 'Reason' },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowActions: () => [],
    selectable: true,
    rowKey: 'id',
  };
}
