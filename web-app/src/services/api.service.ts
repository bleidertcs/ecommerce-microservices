import { Product, FilterParams, CreateProductInput, UpdateProductInput } from "@/types/product.types";
import { API_BASE_URL } from "@/lib/config";

/**
 * Unified API Service for Lumina Web App
 */
export class ApiService {
  private static async fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    return res.json();
  }

  private static async fetcherWithAuth<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
  ): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    return res.json();
  }

  // Products
  static async getProducts(params?: FilterParams): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.search) searchParams.append('search', params.search);
      if (params.category) searchParams.append('category', params.category);
      if (params.minPrice) searchParams.append('minPrice', String(params.minPrice));
      if (params.maxPrice) searchParams.append('maxPrice', String(params.maxPrice));
      if (params.featured !== undefined) searchParams.append('featured', String(params.featured));
    }

    const query = searchParams.toString();
    const json = await this.fetcher<any>(`/api/v1/products${query ? `?${query}` : ''}`, {
      cache: 'no-store'
    });

    // Handle different response formats from backend
    if (Array.isArray(json)) return json;
    if (json.data && Array.isArray(json.data)) return json.data;
    if (json.products && Array.isArray(json.products)) return json.products;
    return [];
  }

  static async getProductById(id: string): Promise<Product> {
    return this.fetcher<Product>(`/api/v1/products/${id}`, {
      cache: 'no-store'
    });
  }

  static async createProduct(data: CreateProductInput, token: string): Promise<Product> {
    return this.fetcherWithAuth<Product>('/api/v1/products', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateProduct(
    id: string,
    data: UpdateProductInput,
    token: string
  ): Promise<Product> {
    return this.fetcherWithAuth<Product>(`/api/v1/products/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(id: string, token: string): Promise<{ id: string }> {
    return this.fetcherWithAuth<{ id: string }>(`/api/v1/products/${id}`, token, {
      method: 'DELETE',
    });
  }
}
