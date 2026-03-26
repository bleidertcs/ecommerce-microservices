"use client";

import React from 'react';
import Link from 'next/link';
import ProductActions from '@/components/products/ProductActions';
import { Product } from '@/types/product.types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const image = product.images && product.images.length > 0 ? product.images[0] : undefined;

    return (
        <div className="surface-card flex flex-col h-full relative transition-all group overflow-hidden border border-border bg-surface rounded-xl p-3">
            <Link
                href={`/products/${product.id}`}
                className="relative w-full overflow-hidden bg-surface-elevated aspect-square block rounded-lg mb-4 flex items-center justify-center p-6"
            >
                <div className="w-full h-full transition-all duration-300 group-hover:scale-[1.02] flex items-center justify-center">
                    {image ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.classList.add('image-placeholder-legacy');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted/20">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex-1 flex flex-col px-1">
                <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors mb-1">
                    <h3 className="text-[13px] font-bold leading-tight line-clamp-2 text-foreground">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-[11px] text-muted mb-4 line-clamp-1 leading-relaxed">
                    Monolithic product
                </p>

                <div className="mt-auto flex justify-between items-center gap-3">
                    <div className="text-foreground">
                        <span className="text-[14px] font-bold font-heading">
                            ${Number(product.price).toFixed(2)}
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
        </div>
    );
}

