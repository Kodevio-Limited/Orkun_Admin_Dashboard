'use client';

import { useState, useEffect } from 'react';
import { Prompt } from './types';
import { promptService } from './service';

interface UsePromptsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

export function usePrompts({ page = 1, pageSize = 10, search = '', category = '' }: UsePromptsOptions = {}) {
  const [data, setData] = useState<Prompt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await promptService.list({ page, pageSize, search, category: category || undefined });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search, category]);

  return { data, total, loading, error, refetch: fetchData };
}

export function usePrompt(id: string) {
  const [data, setData] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await promptService.get(id);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load prompt');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { data, loading, error };
}
