'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
    const { cartCount } = useCart();

    return (
        <a
            href="/cart"
            className="relative flex items-center no-underline text-inherit hover:text-primary transition-colors group"
        >
            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-danger text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-danger/20 border border-white/10">
                    {cartCount}
                </span>
            )}
            <span className="ml-2 font-medium hidden sm:inline-block">Cart</span>
        </a>
    );
}

