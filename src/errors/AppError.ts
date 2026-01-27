/**
 * Base class for all application errors
 * Represents operational errors that should be sent to the client
 */
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
