import { config } from '../../config/env.js';
import { createLogger } from '../logger.js';

const logger = createLogger('UrlValidator');

export function validateUrl(url) {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  if (typeof url !== 'string') {
    return { valid: false, error: 'URL must be a string' };
  }

  if (url.length > config.limits.maxUrlLength) {
    return { valid: false, error: `URL exceeds maximum length of ${config.limits.maxUrlLength}` };
  }

  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(fullUrl);
    return { valid: true, url: fullUrl };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  return { valid: true, email: email.toLowerCase() };
}
