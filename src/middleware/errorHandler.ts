import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  // Sequelize Validation Error
  if (error instanceof ValidationError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message,
        })),
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
