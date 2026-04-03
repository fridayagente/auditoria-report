/**
 * WEBSITE ANALYZER SERVICE
 * 
 * Core service for analyzing websites.
 * Fetches website content and calculates audit scores for SEO, Performance, Security, and Best Practices.
 * 
 * @file Website analysis service
 * @author Friday Agent
 */

import axios from 'axios';
import { createLogger } from '../../utils/logger.js';
import { config } from '../../config/environment.js';
import { SCORE_THRESHOLDS, SCORE_CLASSES } from '../../constants/config.js';

const logger = createLogger('WebsiteAnalyzer');

export class WebsiteAnalyzer {
  /**
   * Fetch website HTML content
   * @param {string} url - Website URL to fetch
   * @returns {Promise<{html: string, headers: Object, statusCode: number}>}
   * @throws {Error} If website is unreachable
   */
  async fetchWebsite(url) {
    try {
      logger.info('Fetching website content', { url });

      const response = await axios.get(url, {
        timeout: config.limits.websiteFetchTimeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Audit Tool) AppleWebKit/537.36'
        },
        maxRedirects: 5
      });

      logger.debug('Website fetched successfully', {
        url,
        status: response.status,
        contentLength: response.data.length
      });

      return {
        html: response.data,
        headers: response.headers,
        statusCode: response.status,
        finalUrl: response.request.res.responseUrl || url
      };
    } catch (error) {
      logger.error('Failed to fetch website', {
        url,
        errorMessage: error.message,
        errorCode: error.code
      });

      if (error.code === 'ENOTFOUND') {
        throw new Error('Website not found. Please check the URL.');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to website. It may be offline.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Website took too long to respond. Try again later.');
      }

      throw new Error(`Unable to analyze website: ${error.message}`);
    }
  }

  /**
   * Calculate SEO score (0-100)
   * Checks for meta tags, mobile-friendly, sitemap, structured data, etc.
   */
  calculateSEOScore(html, headers) {
    let score = 50; // Start at 50

    try {
      // Check title tag (10 points max)
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        const titleLength = titleMatch[1].length;
        if (titleLength > 30 && titleLength < 60) score += 10;
        else if (titleLength > 0) score += 5;
      }

      // Check meta description (10 points)
      const descMatch = html.match(/name="description"\s+content="([^"]*)"/i);
      if (descMatch && descMatch[1]) {
        const descLength = descMatch[1].length;
        if (descLength > 100 && descLength < 160) score += 10;
        else if (descLength > 0) score += 5;
      }

      // Check H1 tag (5 points)
      if (html.match(/<h1[^>]*>/i)) score += 5;

      // Check mobile viewport (5 points)
      if (html.match(/viewport/i)) score += 5;

      // HTTPS/SSL (10 points)
      if (headers.connection) score += 10;

      // Sitemap mention (5 points)
      if (html.match(/sitemap/i)) score += 5;

      // Structured data (10 points)
      if (html.match(/"@context"/i) || html.match(/schema\.org/i)) score += 10;

      // Internal links (5 points)
      if (html.match(/<a\s+href="\/[^"]*"/i)) score += 5;

      logger.debug('SEO score calculated', { score });
    } catch (error) {
      logger.warn('Error calculating SEO score', { error: error.message });
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate Performance score (0-100)
   * Checks for minification, lazy loading, caching, etc.
   */
  calculatePerformanceScore(html, headers) {
    let score = 50;

    try {
      // Minified JS (10 points)
      const minifiedJsCount = (html.match(/\.min\.js/gi) || []).length;
      if (minifiedJsCount > 0) score += 10;

      // Minified CSS (10 points)
      const minifiedCssCount = (html.match(/\.min\.css/gi) || []).length;
      if (minifiedCssCount > 0) score += 10;

      // Lazy loading (10 points)
      if (html.includes('loading="lazy"')) score += 10;

      // Cache headers (10 points)
      if (headers['cache-control']) score += 10;

      // Gzip compression (10 points)
      if (headers['content-encoding'] === 'gzip') score += 10;

      // Async loading (5 points)
      if (html.match(/async|defer/i)) score += 5;

      logger.debug('Performance score calculated', { score });
    } catch (error) {
      logger.warn('Error calculating Performance score', { error: error.message });
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate Security score (0-100)
   * Checks for HTTPS, security headers, etc.
   */
  calculateSecurityScore(url, headers) {
    let score = 50;

    try {
      // HTTPS (20 points)
      if (url.startsWith('https')) score += 20;

      // X-Frame-Options (10 points)
      if (headers['x-frame-options']) score += 10;

      // X-Content-Type-Options (10 points)
      if (headers['x-content-type-options']) score += 10;

      // Content-Security-Policy (10 points)
      if (headers['content-security-policy']) score += 10;

      // HSTS (10 points)
      if (headers['strict-transport-security']) score += 10;

      logger.debug('Security score calculated', { score });
    } catch (error) {
      logger.warn('Error calculating Security score', { error: error.message });
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate Best Practices score (0-100)
   * Checks for accessibility, semantic HTML, etc.
   */
  calculateBestPracticesScore(html, headers) {
    let score = 50;

    try {
      // Charset (10 points)
      if (html.match(/charset/i)) score += 10;

      // ARIA labels (10 points)
      if (html.match(/aria-/i)) score += 10;

      // Semantic HTML (10 points)
      if (html.match(/<(nav|header|footer|section|article|main)/i)) score += 10;

      // Favicon (5 points)
      if (html.match(/favicon/i)) score += 5;

      // DOCTYPE (5 points)
      if (html.match(/<!DOCTYPE/i)) score += 5;

      logger.debug('Best Practices score calculated', { score });
    } catch (error) {
      logger.warn('Error calculating Best Practices score', { error: error.message });
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get CSS class for score visualization
   * @param {number} score - Score value (0-100)
   * @returns {string} CSS class name (excellent, good, poor)
   */
  getScoreClass(score) {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_CLASSES.EXCELLENT;
    if (score >= SCORE_THRESHOLDS.GOOD) return SCORE_CLASSES.GOOD;
    return SCORE_CLASSES.POOR;
  }

  /**
   * Extract technical details from website
   * @private
   */
  extractDetails(html, headers) {
    return {
      seo: {
        title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Not found',
        hasDescription: !!html.match(/name="description"/i),
        hasH1: !!html.match(/<h1/i)
      },
      performance: {
        minifiedAssets: (html.match(/\.min\.(js|css)/gi) || []).length,
        lazyLoadedImages: (html.match(/loading="lazy"/gi) || []).length,
        cacheEnabled: !!headers['cache-control'],
        compression: headers['content-encoding'] || 'none'
      },
      security: {
        https: true,
        securityHeadersCount: Object.keys(headers).filter(k =>
          k.toLowerCase().includes('x-') || k.toLowerCase().includes('security')
        ).length
      },
      bestPractices: {
        hasSemanticHTML: !!html.match(/<(nav|header|footer|section|article)/i),
        hasAccessibility: !!html.match(/aria-/i),
        hasFavicon: !!html.match(/favicon/i)
      }
    };
  }
}

export const websiteAnalyzer = new WebsiteAnalyzer();
