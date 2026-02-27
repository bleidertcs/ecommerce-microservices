"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  glow?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '', 
  style,
  glow = false,
  ...props 
}: ButtonProps) {
  
  const getVariantClass = () => {
    switch(variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'outline': return 'btn-outline';
      case 'glass': return 'btn-glass';
      case 'danger': return 'btn-danger';
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  };

  const combinedClasses = `btn-premium ${getVariantClass()} ${getSizeClass()} ${glow ? 'glow-primary' : ''} ${className}`.trim();

  return (
    <button 
      className={combinedClasses}
      style={style}
      {...props}
    >
      <span className="btn-content">{children}</span>
      <style jsx>{`
        .btn-premium {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition-fast);
          position: relative;
          overflow: hidden;
          border: 1px solid transparent;
          padding: 12px 24px;
          font-size: 14px;
        }

        .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 10px; }
        .btn-lg { padding: 16px 32px; font-size: 16px; border-radius: 14px; }

        .btn-primary {
          background: var(--primary);
          color: white;
        }
        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(6, 127, 249, 0.4);
        }

        .btn-secondary {
          background: var(--surface-elevated);
          color: var(--foreground);
          border-color: var(--border);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-focus);
        }

        .btn-outline {
          background: transparent;
          color: var(--primary);
          border-color: var(--primary);
        }
        .btn-outline:hover {
          background: rgba(6, 127, 249, 0.1);
          transform: translateY(-2px);
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          color: white;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .btn-danger {
          background: var(--danger);
          color: white;
        }
        .btn-danger:hover {
          background: #ff3333;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(255, 0, 0, 0.4);
        }

        .btn-content {
          position: relative;
          z-index: 1;
        }

        button:active {
          transform: translateY(0);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
