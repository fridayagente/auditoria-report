/**
 * CONFIGURATION CONSTANTS
 * 
 * Centralized configuration values for the application.
 * These are used throughout the backend for consistent behavior.
 * 
 * @file Central configuration repository
 * @author Friday Agent
 */

/**
 * Score thresholds for classification
 * @type {Object}
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,  // Score >= 80: Excellent (green)
  GOOD: 60,       // Score 60-79: Good (yellow)
  POOR: 59        // Score < 60: Poor (red)
};

/**
 * CSS classes for score visualization
 * @type {Object}
 */
export const SCORE_CLASSES = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  POOR: 'poor'
};

/**
 * API request timeout limits (in milliseconds)
 * @type {Object}
 */
export const TIMEOUTS = {
  WEBSITE_FETCH: 10000,        // 10 seconds to fetch website
  PDF_GENERATION: 30000,       // 30 seconds to generate PDF
  CLAUDE_API_CALL: 30000,      // 30 seconds for Claude API
  EMAIL_SEND: 15000            // 15 seconds to send email
};

/**
 * Data validation limits
 * @type {Object}
 */
export const VALIDATION_LIMITS = {
  MAX_URL_LENGTH: 2048,        // Maximum URL length
  MAX_EMAIL_LENGTH: 254,       // RFC 5321 standard
  MIN_EMAIL_LENGTH: 3          // Minimum valid email
};

/**
 * Pricing configuration
 * @type {Object}
 */
export const PRICING = {
  REPORT_PRICE_EUR: 29,        // €29 per report
  REPORT_PRICE_CENTS: 2900     // 2900 cents = €29
};

/**
 * API response status codes
 * @type {Object}
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Log levels
 * @type {Object}
 */
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Regular expressions for validation
 * @type {Object}
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  DOMAIN: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
};

/**
 * Feature flags for conditional functionality
 * @type {Object}
 */
export const FEATURES = {
  CLAUDE_ANALYSIS: 'enableClaudeAnalysis',
  STRIPE_PAYMENTS: 'enableStripePayments',
  EMAIL_NOTIFICATIONS: 'enableEmailNotifications',
  PDF_GENERATION: 'enablePdfGeneration'
};

/**
 * Error messages
 * @type {Object}
 */
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format. Please provide a valid website URL.',
  INVALID_EMAIL: 'Invalid email address. Please check and try again.',
  WEBSITE_UNREACHABLE: 'Unable to reach the website. Please check the URL and try again.',
  ANALYSIS_FAILED: 'Website analysis failed. Please try again later.',
  CHECKOUT_FAILED: 'Payment checkout creation failed. Please try again.',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again later.',
  MISSING_ENV_VARS: 'Missing required environment variables.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.'
};

export default {
  SCORE_THRESHOLDS,
  SCORE_CLASSES,
  TIMEOUTS,
  VALIDATION_LIMITS,
  PRICING,
  HTTP_STATUS,
  LOG_LEVELS,
  REGEX,
  FEATURES,
  ERROR_MESSAGES
};
