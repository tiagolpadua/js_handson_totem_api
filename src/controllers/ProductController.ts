import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/ProductService.js';
import type { ProductFilters } from '../services/ProductService.js';

/**
 * ProductController
 * Handles HTTP requests and delegates business logic to ProductService
 */
export class ProductController {
  /**
   * GET /products - List all products with optional filters
   */
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ProductFilters = {
        category: req.query.category as string | undefined,
        inStock: req.query.inStock === 'true',
        search: req.query.search as string | undefined,
      };

      const products = await productService.getAll(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /products/:id - Get a specific product by ID
   */
  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(Number(req.params.id));
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /products/sku/:sku - Get a product by SKU
   */
  static async findBySku(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sku = Array.isArray(req.params.sku) ? req.params.sku[0] : req.params.sku;
      const product = await productService.getBySku(sku);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /products - Create a new product
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /products/:id - Update a product
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(Number(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /products/:id - Delete a product
   */
  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
