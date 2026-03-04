"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import { ApiService } from '@/services/api.service';
import { useAuth } from '@/context/AuthContext';
import { Product, FilterParams } from '@/types/product.types';

function ProductsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Sync state with URL params
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const updateFilters = (newFilters: Partial<FilterParams>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, String(value));
            else params.delete(key);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const resetFilters = () => {
        router.push(pathname);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const filters: FilterParams = {
                    search,
                    category,
                    minPrice,
                    maxPrice,
                };
                const data = await ApiService.getProducts(filters);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);
    }, [search, category, minPrice, maxPrice]);

    const Loader = ({ message }: { message: string }) => (
        <div className="h-[400px] flex flex-col items-center justify-center gap-6">
            <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted text-sm font-medium">{message}</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 animate-fade-in text-foreground">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16 border-b border-white/10 pb-6 sm:pb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight mb-2 leading-tight">
                        Showcase
                    </h1>
                    <p className="text-muted text-sm sm:text-[15px]">
                        Discover our complete collection of luxury tech.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {isAuthenticated && (
                        <Link href="/products/manage/new">
                            <Button variant="primary" size="sm" glow>
                                + Add Product
                            </Button>
                        </Link>
                    )}
                    <span className="font-semibold text-muted text-xs sm:text-sm">
                        <span className="text-primary text-lg sm:text-xl font-heading mr-1">
                            {products.length}
                        </span>
                        items found
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                <aside className="w-full lg:w-[280px] lg:shrink-0 lg:sticky lg:top-28 h-fit">
                    <div className="lg:hidden mb-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => setFiltersOpen((o) => !o)}
                        >
                            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>
                    <div className={`glass-card p-4 sm:p-6 ${!filtersOpen ? 'hidden lg:block' : ''}`}>
                        <h3 className="text-xs uppercase tracking-widest mb-8 text-muted font-bold">
                            Explore
                        </h3>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Universal search..."
                                value={search}
                                onChange={(e) => updateFilters({ search: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] transition-all"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => updateFilters({ category: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                                style={{
                                    backgroundImage:
                                        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(255,255,255,0.4)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '16px',
                                }}
                            >
                                <option value="" className="bg-surface">
                                    All Worlds
                                </option>
                                <option value="Electronics" className="bg-surface">
                                    Electronics
                                </option>
                                <option value="Clothing" className="bg-surface">
                                    Clothing
                                </option>
                                <option value="Home" className="bg-surface">
                                    Home
                                </option>
                                <option value="Toys" className="bg-surface">
                                    Toys
                                </option>
                                <option value="Sports" className="bg-surface">
                                    Sports
                                </option>
                                <option value="Automotive" className="bg-surface">
                                    Automotive
                                </option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-muted">
                                Value Range
                            </label>
                            <div className="flex items-center gap-2.5">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] transition-all"
                                />
                                <span className="text-muted text-xs shadow-white/10 text-center flex-shrink-0">
                                    -
                                </span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] transition-all"
                                />
                            </div>
                        </div>

                        <Button variant="secondary" onClick={resetFilters} className="w-full">
                            Reset World
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    {loading ? (
                        <Loader message="Scanning Lumina Database..." />
                    ) : products.length === 0 ? (
                        <div className="glass-card py-20 px-10 text-center border-dashed border-white/10 flex flex-col items-center">
                            <div className="text-5xl mb-6 opacity-20">∅</div>
                            <h2 className="text-xl font-bold mb-3">No items found in this world</h2>
                            <p className="text-muted text-sm max-w-[300px] mx-auto mb-8 leading-relaxed">
                                Adjust your filters to reveal hidden treasures.
                            </p>
                            <Button onClick={resetFilters}>Clear Filters</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                    <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted text-sm font-medium">Initializing...</p>
                </div>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}

