'use client';

import React from 'react';
import Toast from '@/components/ui/Toast';
import { Toast as ToastType } from '@/context/ToastContext';

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div 
      className="fixed bottom-24 right-6 z-[3000] flex flex-col-reverse items-end gap-2 pointer-events-none"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 pointer-events-auto items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}
