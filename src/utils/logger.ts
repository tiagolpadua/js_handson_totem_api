import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Configure Winston logger with appropriate transports and format
 * Development: Console output with colors
 * Production: File output with JSON format
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata()
  ),
  transports: [
    // Error logs to file
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.json(),
    }),
    // All logs to combined file
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.json(),
    }),
  ],
});

// Console transport only in development
if (isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 2) {
            // Remove service from meta for cleaner output
            const { service: _service, ...rest } = meta;
            if (Object.keys(rest).length > 0) {
              metaStr = ` ${JSON.stringify(rest, null, 0)}`;
            }
          }
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    })
  );
}
