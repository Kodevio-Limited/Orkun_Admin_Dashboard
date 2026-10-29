'use client';

import { useState, useEffect } from 'react';
import { SystemLog } from './types';
import { logService } from './service';

interface UseLogsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useLogs({ page = 1, pageSize = 10, search = '' }: UseLogsOptions = {}) {
  const [data, setData] = useState<SystemLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await logService.list({ page, pageSize, search });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  return { data, total, loading, error, refetch: fetchData };
}
