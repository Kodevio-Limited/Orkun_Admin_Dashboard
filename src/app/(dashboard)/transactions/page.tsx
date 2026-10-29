'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useTransactions } from '@/features/transactions/hooks';
import { getTransactionsTableConfig } from '@/features/transactions/table-config';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, total, loading } = useTransactions({ page, pageSize: 10, search });

  const config = getTransactionsTableConfig(data, total, page, 10, setPage);

  return (
    <div>
      <PageHeader title="Transactions" description="View all payment and credit transactions" />

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search transactions...',
          onSearch: (q) => { setSearch(q); setPage(1); },
        }}
      />
    </div>
  );
}
