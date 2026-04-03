/**
 * ENVIRONMENT CONFIGURATION
 * 
 * Loads and validates all environment variables at application startup.
 * Ensures required configuration is present before the app starts.
 * 
 * @file Environment configuration loader and validator
 * @author Friday Agent
 */

import dotenv from 'dotenv';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Config');

// Load .env file
dotenv.config();

/**
 * List of required environment variables
 * Application will not start without these
 */
const REQUIRED_VARS = [
  'STRIPE_SECRET_KEY',
  'RESEND_API_KEY',
  'CLAUDE_API_KEY'
];

/**
 * Validate all required environment variables are present
 * Exits process if any are missing
 */
function validateEnvironment() {
  const missing = REQUIRED_VARS.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    logger.error('❌ Missing required environment variables', {
      missing: missing.join(', '),
      hint: 'Copy .env.example to .env and fill in your API keys'
    });
    process.exit(1);
  }

  logger.info('✅ Environment validation passed');
}

/**
 * Main configuration object
 * Contains all settings organized by feature
 */
export const config = {
  // ===== SERVER CONFIGURATION =====
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // ===== DATABASE (Future) =====
  database: {
    url: process.env.DATABASE_URL || ''
  },

  // ===== STRIPE PAYMENT CONFIGURATION =====
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    reportPriceEur: 29,
    reportPriceCents: 2900  // €29 in cents
  },

  // ===== RESEND EMAIL CONFIGURATION =====
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    domain: process.env.RESEND_DOMAIN || 'noreply@auditoria-report.com',
    fromName: 'Auditoría Report'
  },

  // ===== CLAUDE AI CONFIGURATION =====
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: 1000,
    timeout: 30000
  },

  // ===== FEATURE FLAGS =====
  // Can be disabled via environment for testing
  features: {
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    stripePayments: process.env.ENABLE_STRIPE_PAYMENTS !== 'false',
    claudeAnalysis: process.env.ENABLE_CLAUDE_ANALYSIS !== 'false',
    pdfGeneration: process.env.ENABLE_PDF_GENERATION !== 'false'
  },

  // ===== API LIMITS =====
  limits: {
    websiteFetchTimeout: 10000,      // 10 seconds to fetch website
    pdfGenerationTimeout: 30000,     // 30 seconds for PDF
    maxConcurrentAnalyses: 10,       // Prevent overload
    maxUrlLength: 2048,
    maxEmailLength: 254
  },

  // ===== LOGGING CONFIGURATION =====
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Validate on load
validateEnvironment();

/**
 * Helper function to check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether the feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return config.features[featureName] === true;
}

/**
 * Helper function to get configuration value with fallback
 * @param {string} path - Config path (e.g., 'stripe.secretKey')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Configuration value or default
 */
export function getConfig(path, defaultValue = null) {
  const keys = path.split('.');
  let value = config;

  for (const key of keys) {
    value = value?.[key];
  }

  return value ?? defaultValue;
}

logger.info('Configuration loaded successfully', {
  port: config.port,
  env: config.nodeEnv,
  frontend: config.frontendUrl
});

export default config;
