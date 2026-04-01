import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductActions from '@/components/products/ProductActions';
import { ApiService } from '@/services/api.service';
import { Product } from '@/types/product.types';

export default async function ProductDetailScreen({ id }: { id: string }) {
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
                    <div className="surface-card aspect-[16/10] overflow-hidden bg-surface-elevated flex items-center justify-center rounded-[32px] border border-border shadow-md relative group">
                        <img
                            src={image}
                            alt={product.name}
                            className="w-[80%] h-[80%] object-contain z-10 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="surface-card border-border p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Latency
                            </span>
                            <span className="text-sm font-bold font-heading">0.02ms</span>
                        </div>
                        <div className="surface-card border-border p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Battery
                            </span>
                            <span className="text-sm font-bold font-heading">48h Elite</span>
                        </div>
                        <div className="surface-card border-border p-4 text-center">
                            <span className="block text-[9px] uppercase text-muted mb-1.5 font-bold tracking-widest">
                                Connection
                            </span>
                            <span className="text-sm font-bold font-heading">Neural 5.0</span>
                        </div>
                    </div>
                </div>

                {/* Info Side */}
                <div className="w-full">
                    <div className="surface-card border-border p-10">
                        <div className="flex gap-3 mb-5 items-center">
                            <span className="text-primary font-extrabold uppercase text-[11px] tracking-[0.1em]">
                                {product.brand || 'Lumina Elite'}
                            </span>
                            <span className="text-muted font-semibold uppercase text-[11px] tracking-[0.1em] border-l border-border pl-3">
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
                                                : 'var(--color-border)'
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

                        <p className="text-base leading-relaxed text-muted mb-10">
                            {product.description ||
                                'Elevate your daily experience with the Lumina Aura. Precision-engineered for those who demand excellence in every detail. Limited availability.'}
                        </p>

                        <div className="bg-surface-elevated rounded-[20px] p-8 border border-border">
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

            {/* Testimonials Section */}
            <div className="mt-24 border-t border-border pt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-heading font-extrabold mb-2 text-foreground tracking-tight">Data Logs & Testimonials</h2>
                        <p className="text-muted text-sm">Real-world operational feedback from verified operatives.</p>
                    </div>
                    <Button variant="secondary" className="whitespace-nowrap">Submit Log</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Review 1 */}
                    <div className="surface-card bg-surface-elevated/50 hover:bg-surface-elevated transition-colors border border-border rounded-[24px] p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center text-[#00e5ff] font-bold font-heading shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                                        NX
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">Nexus Operative</div>
                                        <div className="text-[11px] text-[#00e5ff] uppercase tracking-widest mt-0.5">Verified Sector 7</div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#ffcc00">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[13px] text-[rgba(255,255,255,0.85)] leading-relaxed italic border-l-2 border-[rgba(0,229,255,0.3)] pl-4">
                                "The synchronization rate on this unit is unprecedented. I've integrated it into my daily operations and the latency drop is exactly as advertised. Worth every credit."
                            </p>
                        </div>
                        <div className="mt-8 text-[10px] text-muted text-right font-mono opacity-50">
                            LOGGED: 24.03.2026
                        </div>
                    </div>

                    {/* Review 2 */}
                    <div className="surface-card bg-surface-elevated/50 hover:bg-surface-elevated transition-colors border border-border rounded-[24px] p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[rgba(0,255,170,0.1)] border border-[rgba(0,255,170,0.2)] flex items-center justify-center text-success font-bold font-heading shadow-[0_0_10px_rgba(0,255,170,0.2)]">
                                        K9
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">Kaelen-9</div>
                                        <div className="text-[11px] text-muted uppercase tracking-widest mt-0.5">Standard Node</div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s < 5 ? "#ffcc00" : "var(--color-border)"}>
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[13px] text-[rgba(255,255,255,0.85)] leading-relaxed italic border-l-2 border-[rgba(0,255,170,0.3)] pl-4">
                                "Solid build quality and the neural connection barely drops. Battery life could be slightly longer under heavy load, but overall an exceptional piece of tech. Would recommend."
                            </p>
                        </div>
                        <div className="mt-8 text-[10px] text-muted text-right font-mono opacity-50">
                            LOGGED: 21.03.2026
                        </div>
                    </div>

                    {/* Review 3 */}
                    <div className="surface-card bg-surface-elevated/50 hover:bg-surface-elevated transition-colors border border-border rounded-[24px] p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[rgba(255,0,85,0.1)] border border-[rgba(255,0,85,0.2)] flex items-center justify-center text-danger font-bold font-heading shadow-[0_0_10px_rgba(255,0,85,0.2)]">
                                        V3
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">Valkyrie-3</div>
                                        <div className="text-[11px] text-muted uppercase tracking-widest mt-0.5">Freelancer</div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#ffcc00">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[13px] text-[rgba(255,255,255,0.85)] leading-relaxed italic border-l-2 border-[rgba(255,0,85,0.3)] pl-4">
                                "Initial recalibration took a few attempts, but once locked in, the performance is stellar. The aesthetics perfectly match the Monolith ecosystem."
                            </p>
                        </div>
                        <div className="mt-8 text-[10px] text-muted text-right font-mono opacity-50">
                            LOGGED: 15.03.2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
