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
    glow = false,
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-heading font-semibold cursor-pointer transition-all duration-200 relative overflow-hidden border border-transparent active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(6,127,249,0.4)]',
        secondary: 'bg-surface-elevated text-foreground border-border hover:bg-white/10 hover:border-border-focus',
        outline: 'bg-transparent text-primary border-primary hover:bg-primary/10 hover:-translate-y-0.5',
        glass: 'bg-white/5 backdrop-blur-md text-white border-white/10 hover:bg-white/10 hover:border-white/20',
        danger: 'bg-danger text-white hover:bg-[#ff3333] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(255,0,0,0.4)]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[13px] rounded-lg',
        md: 'px-6 py-3 text-sm rounded-xl',
        lg: 'px-8 py-4 text-base rounded-[14px]',
    };

    const glowStyle = glow ? 'glow-primary' : '';

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${glowStyle} ${className}`.trim();

    return (
        <button className={combinedClasses} {...props}>
            <span className="relative z-10">{children}</span>
        </button>
    );
}

