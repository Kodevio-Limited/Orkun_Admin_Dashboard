'use client';

import { useState, useEffect } from 'react';
import { Campaign } from './types';
import { campaignService } from './service';

interface UseCampaignsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useCampaigns({ page = 1, pageSize = 10, search = '' }: UseCampaignsOptions = {}) {
  const [data, setData] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await campaignService.list({ page, pageSize, search });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  return { data, total, loading, error, refetch: fetchData };
}

export function useCampaign(id: string) {
  const [data, setData] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await campaignService.get(id);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { data, loading, error };
}
