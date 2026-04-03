import axios from 'axios';
import { config } from '../../config/env.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('WebsiteAnalyzer');

export class WebsiteAnalyzer {
  async fetchWebsite(url) {
    try {
      logger.info(`Fetching website`, { url });
      
      const response = await axios.get(url, {
        timeout: config.limits.websiteFetchTimeout,
        headers: { 'User-Agent': 'Mozilla/5.0 (Audit Tool)' },
        maxRedirects: 5
      });

      logger.debug(`Website fetched successfully`, { url, status: response.status });

      return {
        html: response.data,
        headers: response.headers,
        statusCode: response.status,
        url: response.request.res.responseUrl || url
      };
    } catch (error) {
      logger.error(`Failed to fetch website`, { url, error: error.message });
      throw new Error(`Unable to access website: ${error.message}`);
    }
  }

  calculateSEOScore(html, headers) {
    let score = 50;

    // Title
    if (html.match(/<title>[\s\S]*?<\/title>/i)) {
      const title = html.match(/<title>([\s\S]*?)<\/title>/i)[1];
      if (title.length > 30 && title.length < 60) score += 10;
      else if (title.length > 0) score += 5;
    }

    // Meta description
    if (html.match(/name="description"/i)) {
      const desc = html.match(/name="description"\s+content="([^"]*)"/i);
      if (desc && desc[1].length > 100 && desc[1].length < 160) score += 10;
      else if (desc) score += 5;
    }

    // H1
    if (html.match(/<h1>/i)) score += 5;

    // Viewport
    if (html.match(/viewport/i)) score += 5;

    // HTTPS
    score += 10;

    // Sitemap
    if (html.match(/sitemap/i)) score += 5;

    // Structured data
    if (html.match(/"@context"/i)) score += 10;

    return Math.min(100, score);
  }

  calculatePerformanceScore(html, headers) {
    let score = 50;

    const minifiedJS = html.match(/\.min\.js/gi)?.length || 0;
    const minifiedCSS = html.match(/\.min\.css/gi)?.length || 0;

    if (minifiedJS > 0) score += 10;
    if (minifiedCSS > 0) score += 10;

    if (html.includes('loading="lazy"')) score += 10;

    if (headers['cache-control']) score += 10;
    if (headers['content-encoding'] === 'gzip') score += 10;

    return Math.min(100, score);
  }

  calculateSecurityScore(url, headers) {
    let score = 50;

    if (url.startsWith('https')) score += 20;
    if (headers['x-frame-options']) score += 10;
    if (headers['x-content-type-options']) score += 10;
    if (headers['content-security-policy']) score += 10;
    if (headers['strict-transport-security']) score += 10;

    return Math.min(100, score);
  }

  calculateBestPracticesScore(html, headers) {
    let score = 50;

    if (html.match(/charset/i)) score += 10;
    if (html.match(/aria-/i)) score += 10;
    if (html.match(/<(nav|header|footer|section|article)/i)) score += 10;
    if (html.match(/favicon/i)) score += 5;
    if (html.match(/<!DOCTYPE/i)) score += 5;

    return Math.min(100, score);
  }

  getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'poor';
  }
}

export const websiteAnalyzer = new WebsiteAnalyzer();
