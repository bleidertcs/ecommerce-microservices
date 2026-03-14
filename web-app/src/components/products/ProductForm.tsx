'use client';

import React, { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { CreateProductInput } from '@/types/product.types';

interface ProductFormProps {
  defaultValues?: Partial<CreateProductInput> & { id?: string };
  onSubmit: (data: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const defaultEmpty: CreateProductInput = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  brand: '',
  images: [],
  tags: [],
  featured: false,
};

export default function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save',
}: ProductFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? defaultEmpty.name);
  const [description, setDescription] = useState(defaultValues?.description ?? defaultEmpty.description ?? '');
  const [price, setPrice] = useState(String(defaultValues?.price ?? defaultEmpty.price));
  const [stock, setStock] = useState(String(defaultValues?.stock ?? defaultEmpty.stock ?? 0));
  const [category, setCategory] = useState(defaultValues?.category ?? defaultEmpty.category ?? '');
  const [brand, setBrand] = useState(defaultValues?.brand ?? defaultEmpty.brand ?? '');
  const [sku, setSku] = useState(defaultValues?.sku ?? '');
  const [imagesText, setImagesText] = useState(
    Array.isArray(defaultValues?.images) ? defaultValues.images.filter(Boolean).join('\n') : ''
  );
  const [tagsText, setTagsText] = useState(
    Array.isArray(defaultValues?.tags) ? defaultValues.tags.join(', ') : ''
  );
  const [featured, setFeatured] = useState(defaultValues?.featured ?? defaultEmpty.featured ?? false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const priceNum = parseFloat(price);
      const stockNum = parseInt(stock, 10);
      if (!name.trim()) {
        setError('El nombre es obligatorio');
        return;
      }
      if (isNaN(priceNum) || priceNum < 0) {
        setError('El precio debe ser un número válido ≥ 0');
        return;
      }
      if (isNaN(stockNum) || stockNum < 0) {
        setError('El stock debe ser un número entero válido ≥ 0');
        return;
      }
      const images = imagesText
        .split('\n')
        .map((u: string) => u.trim())
        .filter(Boolean);
      const tags = tagsText
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
      try {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          sku: sku.trim() || undefined,
          brand: brand.trim() || undefined,
          price: priceNum,
          stock: stockNum,
          category: category.trim() || undefined,
          images: images.length ? images : undefined,
          tags: tags.length ? tags : undefined,
          featured,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo guardar el producto');
      }
    },
    [name, description, price, stock, category, brand, sku, imagesText, tagsText, featured, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
          placeholder="Product name"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] resize-y"
          placeholder="Product description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Price *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Stock</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
            placeholder="e.g. Electronics"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
            placeholder="Brand name"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">SKU</label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
          placeholder="Optional stock keeping unit"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Image URLs (one per line)</label>
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05] font-mono resize-y"
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/[0.05]"
          placeholder="premium, wireless, elite"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary"
        />
        <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">
          Featured product
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
