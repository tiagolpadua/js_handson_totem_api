import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import { Op } from 'sequelize';

export class ProductController {
  // GET /products - Listar todos os produtos com filtros opcionais
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, inStock, search } = req.query;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};

      if (category && typeof category === 'string') {
        where.category = category;
      }

      if (inStock === 'true') {
        where.stock = { [Op.gt]: 0 };
      }

      if (search && typeof search === 'string') {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { sku: { [Op.like]: `%${search}%` } },
        ];
      }

      const products = await Product.findAll({
        where,
        order: [['name', 'ASC']],
      });

      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  // GET /products/:id - Obter um produto específico
  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(Number(id));

      if (!product) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Produto não encontrado',
          },
        });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // GET /products/sku/:sku - Obter um produto por SKU
  static async findBySku(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sku } = req.params;

      const product = await Product.findOne({ where: { sku } });

      if (!product) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Produto não encontrado',
          },
        });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // POST /products - Criar novo produto
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sku, name, price, stock, category } = req.body;

      // Validação básica
      if (!sku || !name || price === undefined || stock === undefined || !category) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Campos obrigatórios: sku, name, price, stock, category',
          },
        });
        return;
      }

      // Verificar se SKU já existe
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        res.status(409).json({
          error: {
            code: 'CONFLICT',
            message: 'Produto com este SKU já existe',
          },
        });
        return;
      }

      const product = await Product.create({
        sku,
        name,
        price,
        stock,
        category,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  // PUT /products/:id - Atualizar produto
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { sku, name, price, stock, category } = req.body;

      const product = await Product.findByPk(Number(id));

      if (!product) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Produto não encontrado',
          },
        });
        return;
      }

      // Se o SKU está sendo alterado, verificar se não existe outro produto com o mesmo SKU
      if (sku && sku !== product.sku) {
        const existingProduct = await Product.findOne({ where: { sku } });
        if (existingProduct) {
          res.status(409).json({
            error: {
              code: 'CONFLICT',
              message: 'Já existe outro produto com este SKU',
            },
          });
          return;
        }
      }

      await product.update({
        ...(sku && { sku }),
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(category && { category }),
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /products/:id - Deletar produto
  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(Number(id));

      if (!product) {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Produto não encontrado',
          },
        });
        return;
      }

      await product.destroy();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
