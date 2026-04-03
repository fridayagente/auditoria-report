import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/env.js';
import { logger } from './utils/logger.js';
import apiRoutes from './routes/api.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Validate config before starting
validateConfig();

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`✅ Backend running`, {
    port: config.port,
    env: config.nodeEnv,
    frontend: config.frontendUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
