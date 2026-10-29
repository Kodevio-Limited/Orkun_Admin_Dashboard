import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { Transaction } from './types';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui';

const typeLabels: Record<string, string> = {
  payment: 'Payment',
  refund: 'Refund',
  withdrawal: 'Withdrawal',
  credit: 'Credit',
};

export function getTransactionsTableConfig(
  data: Transaction[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      { key: 'userName', header: 'User' },
      { key: 'type', header: 'Type', render: (row) => <Badge variant="default">{typeLabels[(row as unknown as Transaction).type]}</Badge> },
      {
        key: 'amount',
        header: 'Amount',
        render: (row) => {
          const t = row as unknown as Transaction;
          return (
            <span className={t.type === 'refund' || t.type === 'credit' ? 'text-success-600' : 'text-neutral-800'}>
              {t.type === 'refund' || t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
          );
        },
      },
      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={(row as unknown as Transaction).status} /> },
      { key: 'description', header: 'Description', className: 'max-w-xs truncate' },
      { key: 'createdAt', header: 'Date', render: (row) => formatDateTime((row as unknown as Transaction).createdAt) },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowKey: 'id',
  };
}
