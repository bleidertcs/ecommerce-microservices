'use client';

import React, { useEffect, useState } from 'react';
import Button from './Button';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  confirmLabel = 'Accept',
  cancelLabel = 'Cancel',
  onConfirm,
}: ModalProps) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    confirm: '?',
  }[type];

  const colors = {
    success: 'text-success bg-success/10 border-success/20',
    error: 'text-danger bg-danger/10 border-danger/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    info: 'text-primary bg-primary/10 border-primary/20',
    confirm: 'text-primary bg-primary/10 border-primary/20',
  }[type];

  return (
    <div 
      className={`fixed inset-0 z-[150] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className={`glass relative w-full max-w-md overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
        style={{ padding: '32px' }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 mb-6 text-2xl font-bold ${colors}`}>
            {icons}
          </div>

          <h3 className="text-2xl font-heading font-bold mb-3">{title}</h3>
          <p className="text-muted text-base mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            {type === 'confirm' && (
              <Button 
                variant="glass" 
                className="flex-1 justify-center" 
                onClick={onClose}
              >
                {cancelLabel}
              </Button>
            )}
            <Button 
              variant="primary" 
              glow 
              className="flex-1 justify-center"
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
