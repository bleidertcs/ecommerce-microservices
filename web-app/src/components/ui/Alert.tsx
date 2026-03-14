'use client';

import React from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Alert({ 
  type = 'info', 
  title, 
  children, 
  className = '' 
}: AlertProps) {
  const styles = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-danger/10 border-danger/30 text-danger',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    info: 'bg-primary/10 border-primary/30 text-primary',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div className={`flex gap-3 px-4 py-3 rounded-xl border ${styles} ${className}`} role="alert">
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 font-bold text-[10px] mt-0.5">
        {icon}
      </span>
      <div className="flex-1 text-sm">
        {title && <h5 className="font-bold mb-1">{title}</h5>}
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}
