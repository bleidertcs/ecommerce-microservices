export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  stock: number;
  brand: string;
  createdAt?: string;
  updatedAt?: string;
}

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
