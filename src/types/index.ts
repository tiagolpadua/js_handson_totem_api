export interface Product {
  id?: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
