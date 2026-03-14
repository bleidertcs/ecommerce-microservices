'use client';

import React from 'react';
import { Toast as ToastType } from '@/context/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const styles = {
    success: 'border-success/30 text-success',
    error: 'border-danger/30 text-danger',
    warning: 'border-warning/30 text-warning',
    info: 'border-primary/30 text-primary',
  }[toast.type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[toast.type];

  return (
    <div
      className={`glass flex items-center gap-3 px-4 py-2.1 rounded-full border animate-fade-in shadow-lg ${styles}`}
      role="alert"
      style={{ 
        minWidth: '200px',
        maxWidth: '400px',
        background: 'rgba(10, 10, 10, 0.8)',
      }}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/5 font-bold text-[10px]">
        {icon}
      </span>
      <p className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis flex-1">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[10px] opacity-40 hover:opacity-100 transition-opacity p-1"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
