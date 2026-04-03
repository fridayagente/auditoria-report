/**
 * EXPRESS SERVER
 * 
 * Main application entry point.
 * Initializes Express server with middleware, routes, and error handling.
 * 
 * @file Express application setup and server initialization
 * @author Friday Agent
 */

import express from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import { createLogger } from './utils/logger.js';
import apiRoutes from './routes/api.js';
import { errorHandler, notFoundHandler, validationErrorHandler } from './middleware/errorHandler.js';

const logger = createLogger('Server');
const app = express();

// ===== MIDDLEWARE SETUP =====

/**
 * Request validation
 * Parse incoming request bodies with size limits
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * CORS Configuration
 * Allow requests from frontend and trusted origins
 */
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Request logging middleware
 * Log all incoming requests with timestamp and method
 */
app.use((req, res, next) => {
  // Generate unique request ID for tracing
  req.id = Math.random().toString(36).substr(2, 9);

  logger.info(`${req.method} ${req.path}`, {
    requestId: req.id,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next();
});

/**
 * Request timing middleware
 * Measure request duration for performance monitoring
 */
app.use((req, res, next) => {
  const startTime = Date.now();

  // Hook into response.end() to capture duration
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    logger.debug(`Request completed`, {
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    });
    originalEnd.apply(res, args);
  };

  next();
});

// ===== ROUTES =====

/**
 * API Routes
 * All API endpoints defined in routes/api.js
 */
app.use('/api', apiRoutes);

// ===== ERROR HANDLING =====

/**
 * Validation error handler
 * Catches malformed JSON and invalid request bodies
 */
app.use(validationErrorHandler);

/**
 * 404 handler
 * Catches requests to undefined routes
 */
app.use(notFoundHandler);

/**
 * Global error handler
 * Catches all errors and formats responses consistently
 */
app.use(errorHandler);

// ===== SERVER STARTUP =====

/**
 * Start Express server
 */
const server = app.listen(config.port, () => {
  logger.info('✅ Backend server started successfully', {
    port: config.port,
    env: config.nodeEnv,
    frontend: config.frontendUrl,
    time: new Date().toISOString()
  });

  logger.info('📍 API available at', {
    health: `http://localhost:${config.port}/api/health`,
    analyze: `http://localhost:${config.port}/api/analyze`
  });
});

/**
 * Graceful shutdown
 * Close server cleanly on SIGTERM (Docker, Kubernetes, Heroku)
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');

  server.close(() => {
    logger.info('✅ Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

/**
 * Uncaught exception handler
 * Log and exit if unexpected error occurs
 */
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught exception', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});

/**
 * Unhandled promise rejection handler
 * Log unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled promise rejection', {
    reason: String(reason),
    promise: String(promise)
  });
});

export default app;
