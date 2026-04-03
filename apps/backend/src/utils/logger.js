import { config } from '../config/env.js';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.level = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;
  }

  format(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      context: this.context,
      message,
      ...data
    };
  }

  error(message, data) {
    if (this.level >= LOG_LEVELS.error) {
      console.error(JSON.stringify(this.format('ERROR', message, data)));
    }
  }

  warn(message, data) {
    if (this.level >= LOG_LEVELS.warn) {
      console.warn(JSON.stringify(this.format('WARN', message, data)));
    }
  }

  info(message, data) {
    if (this.level >= LOG_LEVELS.info) {
      console.log(JSON.stringify(this.format('INFO', message, data)));
    }
  }

  debug(message, data) {
    if (this.level >= LOG_LEVELS.debug) {
      console.log(JSON.stringify(this.format('DEBUG', message, data)));
    }
  }
}

export function createLogger(context) {
  return new Logger(context);
}

export const logger = new Logger('Core');
