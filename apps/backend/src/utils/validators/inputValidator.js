/**
 * INPUT VALIDATION UTILITIES
 * 
 * Centralized validation functions for all user inputs.
 * These prevent invalid data from reaching business logic.
 * 
 * @file Input validation module
 * @author Friday Agent
 */

import { VALIDATION_LIMITS, REGEX, ERROR_MESSAGES } from '../../constants/config.js';
import { createLogger } from '../logger.js';

const logger = createLogger('InputValidator');

/**
 * Validates and normalizes a website URL
 * 
 * @param {string} url - The URL to validate
 * @returns {{valid: boolean, url?: string, error?: string}}
 * 
 * @example
 * const result = validateUrl('example.com');
 * if (result.valid) {
 *   console.log(result.url); // 'https://example.com'
 * }
 */
export function validateUrl(url) {
  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    logger.warn('URL validation failed: missing or invalid type');
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check length
  if (trimmedUrl.length > VALIDATION_LIMITS.MAX_URL_LENGTH) {
    logger.warn(`URL exceeds max length: ${trimmedUrl.length}`);
    return { valid: false, error: `URL exceeds maximum length of ${VALIDATION_LIMITS.MAX_URL_LENGTH} characters` };
  }

  try {
    // Add protocol if missing
    const fullUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;

    // Validate URL format
    new URL(fullUrl);

    // Additional check: ensure it's not a local URL
    const hostname = new URL(fullUrl).hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      logger.warn(`Attempted to analyze local URL: ${hostname}`);
      return { valid: false, error: 'Cannot analyze local URLs. Please provide a public website.' };
    }

    logger.debug(`URL validated successfully: ${fullUrl}`);
    return { valid: true, url: fullUrl };
  } catch (error) {
    logger.warn(`URL validation error: ${error.message}`);
    return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
  }
}

/**
 * Validates an email address
 * 
 * @param {string} email - The email to validate
 * @returns {{valid: boolean, email?: string, error?: string}}
 * 
 * @example
 * const result = validateEmail('user@example.com');
 * if (result.valid) {
 *   console.log(result.email); // 'user@example.com'
 * }
 */
export function validateEmail(email) {
  // Check if email is provided
  if (!email || typeof email !== 'string') {
    logger.warn('Email validation failed: missing or invalid type');
    return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  // Trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Check length
  if (normalizedEmail.length < VALIDATION_LIMITS.MIN_EMAIL_LENGTH || 
      normalizedEmail.length > VALIDATION_LIMITS.MAX_EMAIL_LENGTH) {
    logger.warn(`Email length invalid: ${normalizedEmail.length}`);
    return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  // Validate format
  if (!REGEX.EMAIL.test(normalizedEmail)) {
    logger.warn(`Email format invalid: ${normalizedEmail}`);
    return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  logger.debug(`Email validated successfully: ${normalizedEmail}`);
  return { valid: true, email: normalizedEmail };
}

/**
 * Sanitizes a string to prevent injection attacks
 * 
 * @param {string} input - The string to sanitize
 * @returns {string} The sanitized string
 * 
 * @example
 * const safe = sanitizeString('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // HTML entity encoding to prevent XSS
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates request body for analysis endpoint
 * 
 * @param {Object} body - The request body
 * @returns {{valid: boolean, data?: {url: string}, error?: string}}
 */
export function validateAnalysisRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { url } = body;
  const urlValidation = validateUrl(url);

  if (!urlValidation.valid) {
    return { valid: false, error: urlValidation.error };
  }

  return { valid: true, data: { url: urlValidation.url } };
}

/**
 * Validates request body for checkout endpoint
 * 
 * @param {Object} body - The request body
 * @returns {{valid: boolean, data?: {email: string, analysis: Object}, error?: string}}
 */
export function validateCheckoutRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { email, analysis } = body;

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, error: emailValidation.error };
  }

  if (!analysis || typeof analysis !== 'object') {
    return { valid: false, error: 'Analysis data is required' };
  }

  return { valid: true, data: { email: emailValidation.email, analysis } };
}

export default {
  validateUrl,
  validateEmail,
  sanitizeString,
  validateAnalysisRequest,
  validateCheckoutRequest
};
