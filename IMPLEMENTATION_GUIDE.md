# 🛠️ Guia Prático de Implementação das Melhorias

## 1. Implementar Camada de Services

### Estrutura de Pastas
```
src/
├── services/
│   ├── ProductService.ts
│   └── index.ts
├── controllers/
│   └── ProductController.ts
├── models/
├── routes/
└── ...
```

### Exemplo: ProductService

```typescript
// src/services/ProductService.ts
import { Op } from 'sequelize';
import Product from '../models/Product.js';
import type { Product as IProduct } from '../types/index.js';
import { NotFoundError, ConflictError } from '../errors/index.js';

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  search?: string;
}

export interface CreateProductInput
  extends Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateProductInput
  extends Partial<Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>> {}

export class ProductService {
  /**
   * Retrieve all products with optional filters
   */
  async getAll(filters: ProductFilters): Promise<IProduct[]> {
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
   */
  async create(data: CreateProductInput): Promise<IProduct> {
    // Verificar se SKU já existe
    const existing = await Product.findOne({ where: { sku: data.sku } });
    if (existing) {
      throw new ConflictError('Produto com este SKU já existe');
    }

    return Product.create(data);
  }

  /**
   * Update product
   */
  async update(id: number, data: UpdateProductInput): Promise<IProduct> {
    const product = await this.getById(id);

    // Se SKU está sendo alterado, verificar unicidade
    if (data.sku && data.sku !== product.sku) {
      const existing = await Product.findOne({ where: { sku: data.sku } });
      if (existing) {
        throw new ConflictError('Já existe outro produto com este SKU');
      }
    }

    return product.update(data);
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<void> {
    const product = await this.getById(id);
    await product.destroy();
  }

  /**
   * Check product availability
   */
  async isAvailable(sku: string, quantity: number): Promise<boolean> {
    const product = await Product.findOne({ where: { sku } });
    return product ? product.stock >= quantity : false;
  }
}

export const productService = new ProductService();
```

### Refatorar Controller

```typescript
// src/controllers/ProductController.ts
import { Request, Response, NextFunction } from 'express';
import { productService, ProductFilters } from '../services/ProductService.js';

export class ProductController {
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

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(Number(req.params.id));
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async findBySku(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await productService.getBySku(req.params.sku);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(Number(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 2. Implementar Tratamento de Erros Customizado

### Criar Classe Base de Erro

```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  public readonly isOperational = true;

  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// src/errors/NotFoundError.ts
import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} não encontrado`, 404, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// src/errors/ConflictError.ts
import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// src/errors/ValidationError.ts
import { AppError } from './AppError.js';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(message: string, public details: ValidationErrorDetail[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// src/errors/index.ts
export { AppError } from './AppError.js';
export { NotFoundError } from './NotFoundError.js';
export { ConflictError } from './ConflictError.js';
export { ValidationError } from './ValidationError.js';
export type { ValidationErrorDetail } from './ValidationError.js';
```

### Atualizar Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { logger } from '../utils/logger.js';
import { AppError, ValidationError } from '../errors/index.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred', { error: error.message, stack: error.stack });

  // AppError customizado
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error instanceof ValidationError && { details: error.details }),
      },
    });
    return;
  }

  // Sequelize Validation Error
  if (error instanceof SequelizeValidationError) {
    const details = error.errors.map(err => ({
      field: err.path,
      message: err.message,
    }));

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details,
      },
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    },
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Rota não encontrada',
    },
  });
};
```

---

## 3. Implementar Validação com Zod

### Instalar Zod
```bash
npm install zod
```

### Criar Schemas

```typescript
// src/schemas/productSchemas.ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
  sku: z.string().min(1).max(50).trim(),
  name: z.string().min(3).max(255).trim(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().nonnegative('Stock cannot be negative'),
  category: z.string().min(1).max(100).trim(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  inStock: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
```

### Criar Middleware de Validação

```typescript
// src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/index.js';

export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const details = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', details));
      }
      next(error);
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const details = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', details));
      }
      next(error);
    }
  };
```

### Usar nos Routes

```typescript
// src/routes/products.routes.ts
import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validateRequest.js';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductFiltersSchema,
} from '../schemas/productSchemas.js';
import { ProductController } from '../controllers/ProductController.js';

const router = Router();

router.get('/', validateQuery(ProductFiltersSchema), ProductController.index);
router.get('/sku/:sku', ProductController.findBySku);
router.get('/:id', ProductController.show);
router.post('/', validateBody(CreateProductSchema), ProductController.create);
router.put('/:id', validateBody(UpdateProductSchema), ProductController.update);
router.delete('/:id', ProductController.destroy);

export default router;
```

---

## 4. Implementar Logger Estruturado

### Instalar Winston
```bash
npm install winston
```

### Criar Logger

```typescript
// src/utils/logger.ts
import winston from 'winston';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    isDevelopment
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        )
      : winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Console transport apenas em desenvolvimento
if (isDevelopment) {
  logger.add(new winston.transports.Console());
}
```

### Usar no Código

```typescript
// src/index.ts
import { logger } from './utils/logger.js';

// Ao iniciar servidor
logger.info('Starting server', { port: PORT, env: process.env.NODE_ENV });

// Em middlewares
logger.debug('Request received', {
  method: req.method,
  path: req.path,
  body: req.body,
});

// Em handlers de erro
logger.error('Database connection failed', {
  error: err.message,
  code: err.code,
});
```

---

## 5. Arquivo de Constantes

```typescript
// src/constants/index.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export const QUERY_PARAMS = {
  CATEGORY: 'category',
  IN_STOCK: 'inStock',
  SEARCH: 'search',
  PAGE: 'page',
  LIMIT: 'limit',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const PRODUCT_CONSTRAINTS = {
  SKU_MIN_LENGTH: 1,
  SKU_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 255,
  CATEGORY_MAX_LENGTH: 100,
  MIN_PRICE: 0,
  MIN_STOCK: 0,
} as const;
```

### Usar nos Schemas

```typescript
import {
  PRODUCT_CONSTRAINTS,
  HTTP_STATUS,
} from '../constants/index.js';

export const CreateProductSchema = z.object({
  sku: z
    .string()
    .min(PRODUCT_CONSTRAINTS.SKU_MIN_LENGTH)
    .max(PRODUCT_CONSTRAINTS.SKU_MAX_LENGTH),
  // ...
});
```

---

## Resumo das Implementações

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/services/ProductService.ts` | Lógica de negócio |
| `src/errors/AppError.ts` | Erros customizados |
| `src/middleware/validateRequest.ts` | Validação de requisição |
| `src/schemas/productSchemas.ts` | Schemas Zod |
| `src/utils/logger.ts` | Logging estruturado |
| `src/constants/index.ts` | Constantes globais |

**Próximas etapas**: Seguir o plano de implementação da análise principal!
