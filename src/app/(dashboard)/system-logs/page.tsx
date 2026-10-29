'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useLogs } from '@/features/system-logs/hooks';
import { getLogsTableConfig } from '@/features/system-logs/table-config';

export default function SystemLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, total, loading } = useLogs({ page, pageSize: 10, search });

  const config = getLogsTableConfig(data, total, page, 10, setPage);

  return (
    <div>
      <PageHeader title="System Logs" description="Monitor system activity and errors" />

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search logs...',
          onSearch: (q) => { setSearch(q); setPage(1); },
        }}
      />
    </div>
  );
}
