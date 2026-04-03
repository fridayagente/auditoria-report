/**
 * LOGGING UTILITY MODULE
 * 
 * Provides centralized logging with different severity levels
 * and structured output for production environments.
 * 
 * Usage:
 *   const logger = createLogger('MyService');
 *   logger.info('Something happened', { userId: 123 });
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

export class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.level = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] || LOG_LEVELS.info;
  }

  /**
   * Internal method to format log output
   * @private
   */
  format(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta
    };
  }

  error(message, meta) {
    if (this.level >= LOG_LEVELS.error) {
      console.error(JSON.stringify(this.format('ERROR', message, meta)));
    }
  }

  warn(message, meta) {
    if (this.level >= LOG_LEVELS.warn) {
      console.warn(JSON.stringify(this.format('WARN', message, meta)));
    }
  }

  info(message, meta) {
    if (this.level >= LOG_LEVELS.info) {
      console.log(JSON.stringify(this.format('INFO', message, meta)));
    }
  }

  debug(message, meta) {
    if (this.level >= LOG_LEVELS.debug) {
      console.log(JSON.stringify(this.format('DEBUG', message, meta)));
    }
  }
}

/**
 * Factory function to create logger instances
 * @param {string} context - The logger context name
 * @returns {Logger} Logger instance
 */
export function createLogger(context) {
  return new Logger(context);
}

export const logger = new Logger('Core');
