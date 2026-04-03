/**
 * ERROR HANDLING MIDDLEWARE
 * 
 * Centralized error handling for the Express application.
 * Catches and formats all errors consistently.
 * 
 * @file Error handler middleware
 * @author Friday Agent
 */

import { createLogger } from '../utils/logger.js';

const logger = createLogger('ErrorHandler');

/**
 * Global error handler middleware
 * Catches all errors from route handlers
 */
export function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';

  // Log error with full context
  logger.error('Unhandled error', {
    requestId,
    message: err.message,
    status: err.status || 500,
    method: req.method,
    path: req.path,
    ip: req.ip,
    stack: err.stack
  });

  // Return error response
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    error: message,
    status: statusCode,
    requestId,
    timestamp: new Date().toISOString()
  });
}

/**
 * 404 Not Found handler
 * Handles requests to undefined routes
 */
export function notFoundHandler(req, res) {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  return res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

/**
 * Request validation error handler
 * Formats validation errors consistently
 */
export function validationErrorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    logger.warn('Invalid JSON in request body', {
      ip: req.ip,
      path: req.path
    });

    return res.status(400).json({
      error: 'Invalid JSON in request body',
      timestamp: new Date().toISOString()
    });
  }

  next(error);
}

export default {
  errorHandler,
  notFoundHandler,
  validationErrorHandler
};
