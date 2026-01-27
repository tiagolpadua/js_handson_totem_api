import { Request, Response, NextFunction } from 'express';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { logger } from '../utils/logger.js';
import { AppError, ValidationError } from '../errors/index.js';

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate responses
 * Distinguishes between operational and programming errors
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    name: error.name,
  });

  // Custom AppError from our errors module
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

  // Generic error
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    },
  });
};

/**
 * 404 Not Found handler
 * Called when no route matches the request
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Rota não encontrada',
    },
  });
};
