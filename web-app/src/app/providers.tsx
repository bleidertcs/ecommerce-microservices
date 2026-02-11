'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { initTracing } from '@/lib/tracing.client';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTracing();
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
