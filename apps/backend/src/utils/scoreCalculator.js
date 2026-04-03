import { SCORE_EXCELLENT, SCORE_GOOD } from '../config/constants.js';

export function calculateSEOScore(html, headers) {
  let score = 50;

  // Title tag
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

  // H1 tag
  if (html.match(/<h1>/i)) score += 5;

  // Mobile viewport
  if (html.match(/viewport/i)) score += 5;

  // SSL (assume https)
  score += 10;

  // Sitemap reference
  if (html.match(/sitemap/i)) score += 5;

  // Structured data
  if (html.match(/"@context"/i)) score += 10;

  return Math.min(100, score);
}

export function calculatePerformanceScore(html, headers) {
  let score = 50;

  const scriptTags = html.match(/<script[^>]*src="[^"]*"/gi) || [];
  const cssLinks = html.match(/<link[^>]*href="[^"]*\.css"/gi) || [];

  if (scriptTags.some(s => s.includes('.min.js'))) score += 10;
  if (cssLinks.some(c => c.includes('.min.css'))) score += 10;

  if (html.includes('loading="lazy"') || html.includes("loading='lazy'")) score += 10;

  if (headers['cache-control']) score += 10;
  if (headers['content-encoding'] === 'gzip') score += 10;

  return Math.min(100, score);
}

export function calculateSecurityScore(url, headers) {
  let score = 50;

  if (url.startsWith('https')) score += 20;

  if (headers['x-frame-options']) score += 10;
  if (headers['x-content-type-options']) score += 10;
  if (headers['content-security-policy']) score += 10;
  if (headers['strict-transport-security']) score += 10;

  return Math.min(100, score);
}

export function calculateBestPracticesScore(html, headers) {
  let score = 50;

  if (html.match(/charset/i)) score += 10;
  if (html.match(/aria-/i)) score += 10;
  if (html.match(/<(nav|header|footer|section|article)[\s>]/i)) score += 10;
  if (html.match(/favicon/i)) score += 5;
  if (html.match(/<!DOCTYPE/i)) score += 5;

  return Math.min(100, score);
}

export function getScoreClass(score) {
  if (score >= SCORE_EXCELLENT) return 'excellent';
  if (score >= SCORE_GOOD) return 'good';
  return 'poor';
}
