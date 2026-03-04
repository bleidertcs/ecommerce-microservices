'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ApiService } from '@/services/api.service';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/product.types';

export default function ManageCatalogPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await ApiService.getProducts({});
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, token, router, fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!token || !confirm(`Delete "${name}"? This will soft-delete the product.`)) return;
    setDeletingId(id);
    try {
      await ApiService.deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight mb-2">
            Catalog Management
          </h1>
          <p className="text-muted text-sm">
            Add, edit, or remove products. Changes appear in the public catalog.
          </p>
        </div>
        <Link href="/products/manage/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add product</Button>
        </Link>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6 text-sm font-medium"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to catalog
      </Link>

      {loading ? (
        <div className="h-[300px] flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card py-16 px-8 text-center border-dashed border-white/10">
          <p className="text-muted mb-6">No products yet.</p>
          <Link href="/products/manage/new">
            <Button>Add your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-xl sm:rounded-[20px] border border-white/10">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-xs font-bold uppercase tracking-wider text-muted px-4 sm:px-6 py-3 sm:py-4">Product</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-muted px-4 sm:px-6 py-3 sm:py-4">Price</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-muted px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Stock</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-muted px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">Category</th>
                  <th className="text-xs font-bold uppercase tracking-wider text-muted px-4 sm:px-6 py-3 sm:py-4 w-28 sm:w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.04] overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold">${Number(p.price).toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm hidden md:table-cell">{p.stock}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-muted hidden lg:table-cell">{p.category || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-2">
                        <Link href={`/products/manage/${p.id}/edit`}>
                          <Button variant="secondary" className="!py-1.5 !px-3 text-xs">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          className="!py-1.5 !px-3 text-xs text-danger hover:bg-danger/10"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? '…' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
