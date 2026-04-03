/**
 * RECOMMENDATION SERVICE
 * 
 * Generates intelligent recommendations using Claude AI.
 * Analyzes website audit scores and provides actionable improvements.
 * 
 * @file Recommendation generation service
 * @author Friday Agent
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { createLogger } from '../../utils/logger.js';
import { config } from '../../config/environment.js';

const logger = createLogger('RecommendationService');

export class RecommendationService {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.claude.apiKey
    });
  }

  /**
   * Get recommendations from Claude AI
   * @param {string} url - Analyzed website URL
   * @param {Object} scores - Website audit scores
   * @returns {Promise<{recommendations: Array, actionPlan: Array}>}
   */
  async getRecommendations(url, scores) {
    // Check if Claude is enabled
    if (!config.features.claudeAnalysis) {
      logger.warn('Claude analysis disabled, using fallback recommendations');
      return this.getFallbackRecommendations();
    }

    try {
      logger.info('Requesting recommendations from Claude', { url });

      const prompt = this.buildPrompt(url, scores);

      const message = await this.client.messages.create({
        model: config.claude.model,
        max_tokens: config.claude.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Parse Claude response
      const responseText = message.content[0].text.trim();
      const parsed = JSON.parse(responseText);

      logger.info('Recommendations generated successfully', {
        url,
        recommendationCount: parsed.recommendations.length
      });

      return parsed;
    } catch (error) {
      logger.error('Failed to get Claude recommendations', {
        url,
        error: error.message
      });

      // Fallback if Claude fails
      return this.getFallbackRecommendations();
    }
  }

  /**
   * Build prompt for Claude
   * @private
   */
  buildPrompt(url, scores) {
    return `You are a website optimization expert. Analyze this audit data and provide recommendations.

Website: ${url}
SEO Score: ${scores.seo}/100
Performance Score: ${scores.performance}/100
Security Score: ${scores.security}/100
Best Practices Score: ${scores.bestPractices}/100

Provide ONLY valid JSON (no markdown, no code blocks):
{
  "recommendations": [
    {
      "title": "specific recommendation",
      "priority": "high|medium|low",
      "impact": "estimated impact description",
      "effort": "easy|medium|hard"
    }
  ],
  "actionPlan": ["action 1", "action 2", "action 3"]
}`;
  }

  /**
   * Fallback recommendations when Claude is unavailable
   * @private
   */
  getFallbackRecommendations() {
    logger.info('Using fallback recommendations');

    return {
      recommendations: [
        {
          title: 'Improve Core Web Vitals',
          priority: 'high',
          impact: 'Better SEO ranking and improved user experience',
          effort: 'medium'
        },
        {
          title: 'Implement Security Headers',
          priority: 'high',
          impact: 'Protect against common web vulnerabilities',
          effort: 'easy'
        },
        {
          title: 'Optimize Images and Assets',
          priority: 'medium',
          impact: 'Faster page load times and better performance',
          effort: 'medium'
        },
        {
          title: 'Enable GZIP Compression',
          priority: 'medium',
          impact: 'Reduce bandwidth usage and improve load times',
          effort: 'easy'
        },
        {
          title: 'Add Responsive Design',
          priority: 'medium',
          impact: 'Better mobile experience and SEO ranking',
          effort: 'hard'
        }
      ],
      actionPlan: [
        'Add security headers (X-Frame-Options, Content-Security-Policy, X-Content-Type-Options)',
        'Enable image lazy loading and compression',
        'Improve server response time and implement caching strategy'
      ]
    };
  }
}

export const recommendationService = new RecommendationService();
