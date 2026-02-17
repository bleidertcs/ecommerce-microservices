'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import dynamic from 'next/dynamic';

const TraceInitializer = dynamic(() => import('@/components/layout/TraceInitializer'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("🟢 Providers mounting...");
  useEffect(() => {
    console.log("🚀 Providers mounting complete");
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <TraceInitializer />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
