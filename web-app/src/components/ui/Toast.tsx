'use client';

import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '@/context/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const typeConfig = {
  success: { icon: '✓', accent: '#22c55e', label: 'Success' },
  error:   { icon: '✕', accent: '#ef4444', label: 'Error'   },
  warning: { icon: '⚠', accent: '#f59e0b', label: 'Warning' },
  info:    { icon: 'ℹ', accent: '#067ff9', label: 'Info'    },
};

export default function Toast({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const { icon, accent } = typeConfig[toast.type];

  return (
    <div
      role="alert"
      onClick={() => onRemove(toast.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        borderRadius: '12px',
        border: `1px solid ${accent}40`,
        background: 'rgba(10,10,14,0.95)',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px ${accent}20`,
        minWidth: '220px',
        maxWidth: '360px',
        cursor: 'pointer',
        userSelect: 'none',
        // Slide-in animation
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
      }}
    >
      {/* Icon badge */}
      <span
        style={{
          flexShrink: 0,
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: `${accent}25`,
          border: `1px solid ${accent}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
          fontSize: '10px',
          fontWeight: 700,
        }}
      >
        {icon}
      </span>
      {/* Message — always white/legible */}
      <p style={{ fontSize: '13px', fontWeight: 500, color: '#e8e8f0', flex: 1, margin: 0, lineHeight: 1.4 }}>
        {toast.message}
      </p>
    </div>
  );
}
