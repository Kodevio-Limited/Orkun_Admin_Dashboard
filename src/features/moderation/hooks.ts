'use client';

import { useState, useEffect } from 'react';
import { ScanResult, SafetySettings } from './types';
import { moderationService } from './service';

interface UseModerationOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export function useModeration({ page = 1, pageSize = 10, search = '', status = '' }: UseModerationOptions = {}) {
  const [data, setData] = useState<ScanResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await moderationService.list({ page, pageSize, search, status: status || undefined });
      setData(result.data);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load scan results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search, status]);

  return { data, total, loading, error, refetch: fetchData };
}

export function useModerationStats() {
  const [stats, setStats] = useState({ scannedToday: 0, approved: 0, rejected: 0, flagged: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await moderationService.getStats();
      setStats(result);
      setLoading(false);
    };
    fetch();
  }, []);

  return { stats, loading };
}

export function useSafetySettings() {
  const [settings, setSettings] = useState<SafetySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await moderationService.getSettings();
      setSettings(result);
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading, setSettings };
}
