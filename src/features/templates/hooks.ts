'use client';

import { useState, useEffect } from 'react';
import { Template } from './types';
import { templateService } from './service';

interface UseTemplatesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useTemplates({ page = 1, pageSize = 10, search = '' }: UseTemplatesOptions = {}) {
  const [data, setData] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateService.list({ page, pageSize, search });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search]);

  return { data, total, loading, error, refetch: fetchData };
}

export function useTemplate(id: string) {
  const [data, setData] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await templateService.get(id);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { data, loading, error };
}
