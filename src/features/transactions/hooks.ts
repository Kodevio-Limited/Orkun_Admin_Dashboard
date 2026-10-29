'use client';

import { useState, useEffect } from 'react';
import { Transaction } from './types';
import { transactionService } from './service';

interface UseTransactionsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useTransactions({ page = 1, pageSize = 10, search = '' }: UseTransactionsOptions = {}) {
  const [data, setData] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.list({ page, pageSize, search });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  return { data, total, loading, error, refetch: fetchData };
}
