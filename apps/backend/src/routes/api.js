import express from 'express';
import { analyzeController } from '../controllers/analyzeController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auditoria-report-api' });
});

// Analysis
router.post('/analyze', (req, res) => analyzeController.analyze(req, res));

// Payments
router.post('/checkout', (req, res) => analyzeController.createCheckout(req, res));
router.post('/payment-success', (req, res) => analyzeController.handlePaymentSuccess(req, res));

export default router;
