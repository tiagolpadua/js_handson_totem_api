import { Op } from 'sequelize';
import Product from '../models/Product.js';
import type { Product as IProduct } from '../types/index.js';
import { NotFoundError, ConflictError } from '../errors/index.js';

/**
 * Filters for retrieving products
 */
export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  search?: string;
}

/**
 * Input data for creating a product
 */
export type CreateProductInput = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input data for updating a product
 */
export type UpdateProductInput = Partial<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Service layer for product business logic
 * Encapsulates all product-related operations
 */
export class ProductService {
  /**
   * Retrieve all products with optional filters
   * @param filters - Optional filters (category, inStock, search)
   * @returns Array of products matching the filters
   */
  async getAll(filters: ProductFilters): Promise<IProduct[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.inStock) {
      where.stock = { [Op.gt]: 0 };
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { sku: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    return Product.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Product data or throws NotFoundError
   */
  async getById(id: number): Promise<IProduct> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new NotFoundError('Produto');
    }
    return product;
  }

  /**
   * Get product by SKU
   * @param sku - Product SKU
   * @returns Product data or throws NotFoundError
   */
  async getBySku(sku: string): Promise<IProduct> {
    const product = await Product.findOne({ where: { sku } });
    if (!product) {
      throw new NotFoundError('Produto');
    }
    return product;
  }

  /**
   * Create new product
   * @param data - Product data
   * @returns Created product or throws ConflictError if SKU exists
   */
  async create(data: CreateProductInput): Promise<IProduct> {
    // Check if SKU already exists
    const existing = await Product.findOne({ where: { sku: data.sku } });
    if (existing) {
      throw new ConflictError('Produto com este SKU já existe');
    }

    return Product.create(data);
  }

  /**
   * Update product
   * @param id - Product ID
   * @param data - Partial product data to update
   * @returns Updated product or throws NotFoundError/ConflictError
   */
  async update(id: number, data: UpdateProductInput): Promise<IProduct> {
    const product = await this.getById(id);

    // If SKU is being changed, check for uniqueness
    if (data.sku && data.sku !== product.sku) {
      const existing = await Product.findOne({ where: { sku: data.sku } });
      if (existing) {
        throw new ConflictError('Já existe outro produto com este SKU');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (product as any).update(data);
    return product;
  }

  /**
   * Delete product
   * @param id - Product ID
   * @throws NotFoundError if product doesn't exist
   */
  async delete(id: number): Promise<void> {
    const product = await this.getById(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (product as any).destroy();
  }

  /**
   * Check product availability
   * @param sku - Product SKU
   * @param quantity - Quantity to check
   * @returns True if product has enough stock
   */
  async isAvailable(sku: string, quantity: number): Promise<boolean> {
    const product = await Product.findOne({ where: { sku } });
    return product ? product.stock >= quantity : false;
  }
}

// Singleton instance
export const productService = new ProductService();
