'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { ModalProvider } from '@/context/ModalContext';
import { CartAnimationProvider } from '@/context/CartAnimationContext';
import dynamic from 'next/dynamic';

const TraceInitializer = dynamic(() => import('@/components/layout/TraceInitializer'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("🟢 Providers mounting...");
  useEffect(() => {
    console.log("🚀 Providers mounting complete");
  }, []);

  return (
    <AuthProvider>
      <ModalProvider>
        <CartProvider>
          <CartAnimationProvider>
            <ToastProvider>
              <TraceInitializer />
              {children}
            </ToastProvider>
          </CartAnimationProvider>
        </CartProvider>
      </ModalProvider>
    </AuthProvider>
  );
}
