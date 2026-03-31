'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
    const { cartCount } = useCart();
    const prevCountRef = useRef(cartCount);
    const [bouncing, setBouncing] = useState(false);

    useEffect(() => {
        if (cartCount > prevCountRef.current) {
            setBouncing(true);
            const t = setTimeout(() => setBouncing(false), 500);
            return () => clearTimeout(t);
        }
        prevCountRef.current = cartCount;
    }, [cartCount]);

    return (
        <a
            id="global-cart-icon"
            href="/cart"
            className="relative flex items-center no-underline text-inherit hover:text-primary transition-colors group"
        >
            <span
                className="text-2xl transition-transform"
                style={{
                    display: 'inline-block',
                    transform: bouncing ? 'scale(1.4)' : 'scale(1)',
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                🛒
            </span>
            {cartCount > 0 && (
                <span
                    className="absolute -top-2 -right-2 bg-danger text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-danger/20 border border-white/10"
                    style={{
                        transform: bouncing ? 'scale(1.3)' : 'scale(1)',
                        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    {cartCount}
                </span>
            )}
            <span className="ml-2 font-medium hidden sm:inline-block">Cart</span>
        </a>
    );
}
