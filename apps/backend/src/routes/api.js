/**
 * API ROUTES
 * 
 * Defines all API endpoints for the application.
 * Routes are organized by feature domain.
 * 
 * @file API routes configuration
 * @author Friday Agent
 */

import express from 'express';
import { analyzeController } from '../controllers/analyzeController.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Routes');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint for monitoring
 * 
 * Response:
 *   - status (string): 'ok' if service is healthy
 *   - service (string): Service identifier
 *   - timestamp (string): Current timestamp
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'auditoria-report-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * POST /api/analyze
 * Analyze a website
 * 
 * Request body:
 *   - url (string, required): Website URL to analyze
 * 
 * Response:
 *   - success (boolean): Request success
 *   - analysis (object): Complete audit analysis
 *   - error (string): Error message if failed
 * 
 * Example:
 *   POST /api/analyze
 *   { "url": "example.com" }
 */
router.post('/analyze', async (req, res) => {
  logger.debug('POST /api/analyze', { ip: req.ip });
  await analyzeController.analyze(req, res);
});

/**
 * Error handling for 404 routes
 */
router.use((req, res) => {
  logger.warn('Route not found', { method: req.method, path: req.path });
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

export default router;
