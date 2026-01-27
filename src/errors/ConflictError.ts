import { AppError } from './AppError.js';

/**
 * Error thrown when there's a conflict (e.g., duplicate SKU)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
