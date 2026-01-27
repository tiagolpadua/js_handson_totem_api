import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { errorHandler, notFoundHandler } from './errorHandler.js';
import { jest } from '@jest/globals';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
    mockNext = jest.fn() as any;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}) as any;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('errorHandler', () => {
    it('should handle ValidationError', () => {
      const validationError = new ValidationError('Validation error', [
        // @ts-expect-error - Partial ValidationErrorItem for testing
        {
          message: 'Field is required',
          type: 'validation error',
          path: 'name',
        },
      ]);

      errorHandler(validationError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação',
          details: [
            {
              field: 'name',
              message: 'Field is required',
            },
          ],
        },
      });
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Something went wrong');

      errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor',
        },
      });
    });

    it('should include error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const genericError = new Error('Test error');

      errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: 'Test error',
          }),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 with error message', () => {
      notFoundHandler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 'NOT_FOUND',
          message: 'Rota não encontrada',
        },
      });
    });
  });
});
