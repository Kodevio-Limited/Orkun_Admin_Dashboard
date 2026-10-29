'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, initialized } = useAuth();

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login');
    }
  }, [initialized, user, router]);

  if (!initialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
