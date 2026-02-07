import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className, 
  style,
  ...props 
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 28px' : '10px 20px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--primary)',
      color: 'white',
    },
    secondary: {
      background: 'var(--secondary)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
    },
  };

  return (
    <button 
      className={className}
      style={{ ...baseStyles, ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
