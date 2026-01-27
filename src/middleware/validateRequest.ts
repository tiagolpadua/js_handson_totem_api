import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/index.js';

/**
 * Middleware factory to validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validação falhou', details));
      }
      next(error);
    }
  };

/**
 * Middleware factory to validate query parameters against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateQuery =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validação falhou', details));
      }
      next(error);
    }
  };
