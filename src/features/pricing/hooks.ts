'use client';

import { useState, useEffect } from 'react';
import { PricingPlan, CreditTransaction } from './types';
import { pricingService } from './service';

export function usePricingPlans() {
  const [data, setData] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = () => setVersion((v) => v + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await pricingService.getPlans();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [version]);

  return { data, loading, error, refetch };
}

export function useCreditTransactions() {
  const [data, setData] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await pricingService.getCreditTransactions();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load credit transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
