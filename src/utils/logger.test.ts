import { logger } from '../utils/logger.js';

describe('Logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have required methods', () => {
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it('should log messages without errors', () => {
    expect(() => {
      logger.info('Test info message');
      logger.error('Test error message');
      logger.warn('Test warn message');
      logger.debug('Test debug message');
    }).not.toThrow();
  });

  it('should log with metadata', () => {
    expect(() => {
      logger.info('Test with metadata', { key: 'value' });
      logger.error('Error with metadata', { error: 'test error' });
    }).not.toThrow();
  });
});
