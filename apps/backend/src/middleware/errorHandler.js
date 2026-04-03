import { createLogger } from '../utils/logger.js';

const logger = createLogger('ErrorHandler');

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
}
