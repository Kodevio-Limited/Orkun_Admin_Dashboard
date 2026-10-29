'use client';

import { useState, useCallback, useEffect } from 'react';
import { LoginPayload, AuthUser } from './types';
import { authService } from './service';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (stored) setUser(stored);
    setInitialized(true);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.login(payload);
      setUser(u);
      return u;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, loading, error, login, logout, initialized };
}
