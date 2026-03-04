"use client";

import React from 'react';
import Link from 'next/link';
import ProductActions from './ProductActions';
import { Product } from '@/types/product.types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const image = product.images && product.images.length > 0 ? product.images[0] : undefined;

    return (
        <div className="glass-card flex flex-col h-full relative p-2 rounded-[20px] transition-all">
            <Link
                href={`/products/${product.id}`}
                className="relative w-full rounded-[14px] overflow-hidden bg-white/[0.02] aspect-[4/3] block group"
            >
                <div className="w-full h-full transition-all duration-300 group-hover:scale-[1.02]">
                    {image ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (
                                    e.target as HTMLImageElement
                                ).parentElement!.classList.add('image-placeholder-legacy');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.05] text-white/20">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em] text-white border border-white/10">
                    {product.category}
                </div>
            </Link>

            <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3 gap-2">
                    <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-[13px] font-semibold leading-relaxed line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {product.rating || '4.5'}
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center gap-3">
                    <div className="flex items-baseline text-foreground">
                        <span className="text-xs font-semibold opacity-70 mr-0.5">$</span>
                        <span className="text-base font-extrabold font-heading">
                            {Number(product.price).toFixed(2)}
                        </span>
                    </div>
                    <ProductActions
                        productId={product.id}
                        price={product.price}
                        productName={product.name}
                        productImage={image}
                    />
                </div>
            </div>

            <style jsx>{`
                /* Legacy support for JS dynamic class injection */
                :global(.image-placeholder-legacy) {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.02) 0%,
                        rgba(255, 255, 255, 0.05) 100%
                    );
                    color: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

