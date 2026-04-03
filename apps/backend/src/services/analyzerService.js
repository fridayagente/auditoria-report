import axios from 'axios';
import { Anthropic } from '@anthropic-ai/sdk';
import {
  calculateSEOScore,
  calculatePerformanceScore,
  calculateSecurityScore,
  calculateBestPracticesScore,
  getScoreClass
} from '../utils/scoreCalculator.js';
import { WEBSITE_FETCH_TIMEOUT, CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '../config/constants.js';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

export async function analyzeWebsite(url) {
  try {
    // Fetch website
    const response = await axios.get(url, { 
      timeout: WEBSITE_FETCH_TIMEOUT,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = response.data;
    const headers = response.headers;

    // Calculate scores
    const seoScore = calculateSEOScore(html, headers);
    const performanceScore = calculatePerformanceScore(html, headers);
    const securityScore = calculateSecurityScore(url, headers);
    const bestPracticesScore = calculateBestPracticesScore(html, headers);
    const overallScore = Math.round(
      (seoScore + performanceScore + securityScore + bestPracticesScore) / 4
    );

    // Get Claude recommendations
    const recommendations = await getRecommendationsFromClaude(url, html, {
      seoScore,
      performanceScore,
      securityScore,
      bestPracticesScore
    });

    return {
      url,
      timestamp: new Date().toISOString(),
      scores: {
        seo: { score: seoScore, class: getScoreClass(seoScore) },
        performance: { score: performanceScore, class: getScoreClass(performanceScore) },
        security: { score: securityScore, class: getScoreClass(securityScore) },
        bestPractices: { score: bestPracticesScore, class: getScoreClass(bestPracticesScore) },
        overall: { score: overallScore, class: getScoreClass(overallScore) }
      },
      recommendations: recommendations.recommendations,
      actionPlan: recommendations.actionPlan,
      details: extractDetails(html, headers)
    };
  } catch (error) {
    throw new Error(`Website analysis failed: ${error.message}`);
  }
}

async function getRecommendationsFromClaude(url, html, scores) {
  try {
    const prompt = `Analyze this website audit data and provide recommendations in JSON format:

URL: ${url}
SEO Score: ${scores.seoScore}/100
Performance Score: ${scores.performanceScore}/100
Security Score: ${scores.securityScore}/100
Best Practices Score: ${scores.bestPracticesScore}/100

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "recommendations": [
    {
      "title": "specific recommendation",
      "priority": "high|medium|low",
      "impact": "estimated impact",
      "effort": "easy|medium|hard"
    }
  ],
  "actionPlan": ["action 1", "action 2", "action 3"]
}`;

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0].text.trim();
    return JSON.parse(content);
  } catch (error) {
    // Fallback recommendations
    return {
      recommendations: [
        {
          title: 'Improve Core Web Vitals',
          priority: 'high',
          impact: 'Better SEO ranking and user experience',
          effort: 'medium'
        },
        {
          title: 'Add security headers',
          priority: 'high',
          impact: 'Protect against common attacks',
          effort: 'easy'
        },
        {
          title: 'Optimize images',
          priority: 'medium',
          impact: 'Faster load times',
          effort: 'medium'
        }
      ],
      actionPlan: [
        'Implement security headers (X-Frame-Options, CSP)',
        'Optimize and lazy-load images',
        'Improve server response time'
      ]
    };
  }
}

function extractDetails(html, headers) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Not found';
  const description = html.match(/name="description"\s+content="([^"]*)"/i)?.[1] || 'Not found';
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, '') || 'Not found';

  return {
    seo: { title, description, h1 },
    performance: {
      minifiedAssets: html.match(/\.min\.(js|css)/gi)?.length || 0,
      lazyLoadedImages: html.match(/loading="lazy"/gi)?.length || 0,
      cacheEnabled: !!headers['cache-control'],
      compression: headers['content-encoding'] || 'none'
    },
    security: {
      https: true,
      securityHeaders: Object.keys(headers).filter(k => 
        k.toLowerCase().includes('x-') || k.toLowerCase().includes('content-security')
      ).length
    },
    bestPractices: {
      hasSemanticHTML: !!html.match(/<(nav|header|footer|section|article)[\s>]/i),
      hasAccessibility: !!html.match(/aria-/i),
      hasFavicon: !!html.match(/favicon/i)
    }
  };
}
