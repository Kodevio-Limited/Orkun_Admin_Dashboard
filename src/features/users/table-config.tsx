import { DataTableConfig } from '@/components/shared/data-table/data-table.types';
import { User } from './types';
import { formatDate, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui';

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
};

const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  active: 'success',
  deleted: 'danger',
  deactivated: 'warning',
};

export function getUsersTableConfig(
  data: User[],
  total: number,
  page: number,
  pageSize: number,
  onPageChange: (p: number) => void
): DataTableConfig {
  return {
    columns: [
      {
        key: 'name',
        header: 'User',
        render: (row) => {
          const u = row as unknown as User;
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium">
                {getInitials(u.name)}
              </div>
              <div>
                <p className="font-medium text-neutral-800">{u.name}</p>
                <p className="text-xs text-neutral-400">{u.email}</p>
              </div>
            </div>
          );
        },
      },
      { key: 'role', header: 'Role', render: (row) => <Badge variant={(row as unknown as User).role === 'admin' ? 'info' : 'default'}>{roleLabels[(row as unknown as User).role]}</Badge> },
      { key: 'plan', header: 'Plan', render: (row) => (row as unknown as User).plan },
      { key: 'imageGenerated', header: 'Images', render: (row) => (row as unknown as User).imageGenerated.toLocaleString() },
      { key: 'initialCredit', header: 'Credits', render: (row) => (row as unknown as User).initialCredit.toLocaleString() },
      { key: 'status', header: 'Status', render: (row) => <Badge variant={statusVariant[(row as unknown as User).status]}>{row.status as string}</Badge> },
      { key: 'lastActive', header: 'Last Active', render: (row) => formatDate((row as unknown as User).lastActive) },
      { key: 'joinedAt', header: 'Joined', render: (row) => formatDate((row as unknown as User).joinedAt) },
    ],
    data: data as unknown as Record<string, unknown>[],
    pagination: { page, pageSize, total, onPageChange },
    rowActions: () => [],
    selectable: true,
    rowKey: 'id',
  };
}
