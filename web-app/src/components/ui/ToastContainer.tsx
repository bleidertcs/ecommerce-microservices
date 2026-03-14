'use client';

import React from 'react';
import Toast from './Toast';
import { Toast as ToastType } from '@/context/ToastContext';

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div 
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 w-full pointer-events-none"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}
