import { AppError } from './AppError.js';

/**
 * Details about a single validation error
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

/**
 * Error thrown when request validation fails
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public details: ValidationErrorDetail[] = []
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
