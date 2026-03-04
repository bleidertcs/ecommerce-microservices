import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductActions from '@/components/products/ProductActions';
import { ApiService } from '@/services/api.service';
import { Product } from '@/types/product.types';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    let product: Product | null = null;

    try {
        product = await ApiService.getProductById(id);
    } catch (error) {
        console.error('Error fetching product:', error);
    }

    if (!product) {
        return (
            <div className="max-w-[1400px] mx-auto px-8 py-24 text-center">
                <h1 className="text-clamp-md font-heading font-extrabold mb-6">
                    Lost in the Nebula
                </h1>
                <p className="text-muted mb-10">The item you are looking for has drifted away.</p>
                <Link href="/products">
                    <Button variant="primary">Return to Catalog</Button>
                </Link>
            </div>
        );
    }

    const image = product.images?.[0] || 'https://via.placeholder.com/1000x800?text=Lumina+Premium';

    return (
        <div className="max-w-[1400px] mx-auto px-8 py-24 animate-fade-in text-foreground">
            <Link
                href="/products"
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-12 text-sm font-medium group w-fit"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:-translate-x-1 transition-transform"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Showcase
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
                {/* Visual Side */}
                <div className="relative">
                    <div className="glass-card aspect-[16/10] overflow-hidden bg-radial-at-center from-[#1a1a1a] to-[#050505] flex items-center justify-center rounded-[32px] border border-white/10 shadow-2xl relative group">
                        <img
                            src={image}
                            alt={product.name}
                            className="w-[80%] h-[80%] object-contain z-10 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="glass-card p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Latency
                            </span>
                            <span className="text-sm font-bold font-heading">0.02ms</span>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Battery
                            </span>
                            <span className="text-sm font-bold font-heading">48h Elite</span>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Connection
                            </span>
                            <span className="text-sm font-bold font-heading">Neural 5.0</span>
                        </div>
                    </div>
                </div>

                {/* Info Side */}
                <div className="w-full">
                    <div className="glass-card p-10">
                        <div className="flex gap-3 mb-5 items-center">
                            <span className="text-primary font-extrabold uppercase text-[11px] tracking-[0.1em]">
                                {product.brand || 'Lumina Elite'}
                            </span>
                            <span className="text-muted font-semibold uppercase text-[11px] tracking-[0.1em] border-l border-white/10 pl-3">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl font-heading font-extrabold leading-tight mb-4 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <svg
                                        key={s}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill={
                                            s <= (product!.rating || 5)
                                                ? '#ffcc00'
                                                : 'rgba(255,255,255,0.1)'
                                        }
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-muted font-medium">
                                ({product.reviewCount || 0} reviews)
                            </span>
                        </div>

                        <p className="text-base leading-relaxed text-white/70 mb-10">
                            {product.description ||
                                'Elevate your daily experience with the Lumina Aura. Precision-engineered for those who demand excellence in every detail. Limited availability.'}
                        </p>

                        <div className="bg-white/[0.02] rounded-[20px] p-8 border border-white/10">
                            <div className="mb-7">
                                <span className="block text-[10px] font-bold uppercase text-muted mb-1.5 tracking-widest">
                                    Investment
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-semibold text-primary mr-1">$</span>
                                    <span className="text-4xl font-extrabold font-heading tracking-tighter">
                                        {Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <ProductActions
                                productId={product.id}
                                price={product.price}
                                productName={product.name}
                                productImage={image}
                            />

                            <div className="mt-6 flex items-center gap-2.5 text-xs text-muted font-semibold">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        product.stock > 0
                                            ? 'bg-success shadow-[0_0_8px_var(--success)]'
                                            : 'bg-danger shadow-[0_0_8px_var(--danger)]'
                                    }`}
                                ></div>
                                <span>
                                    {product.stock > 0
                                        ? `${product.stock} units in reserve`
                                        : 'Reserve Depleted'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

