import { z } from 'zod';

/**
 * Schema for creating a new product
 */
export const CreateProductSchema = z.object({
  sku: z.string().min(1).max(50).trim(),
  name: z.string().min(3).max(255).trim(),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().nonnegative('Estoque não pode ser negativo'),
  category: z.string().min(1).max(100).trim(),
});

/**
 * Schema for updating a product (all fields optional)
 */
export const UpdateProductSchema = CreateProductSchema.partial();

/**
 * Schema for product query filters
 */
export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  inStock: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
});

// Type exports for use in controllers and services
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
