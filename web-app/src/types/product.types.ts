export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  featured: boolean;
  images: string[] | null;
  rating: number;
  reviewCount: number;
  category: string | null;
  stock: number;
  brand: string | null;
  sku?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  sku?: string;
  brand?: string;
  price: number;
  stock?: number;
  category?: string;
  images?: string[];
  tags?: string[];
  featured?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  featured?: boolean;
}
