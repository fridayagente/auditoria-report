import { Anthropic } from '@anthropic-ai/sdk';
import { config } from '../../config/env.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('RecommendationService');

export class RecommendationService {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.claude.apiKey
    });
  }

  async getRecommendations(url, scores) {
    if (!config.features.claudeAnalysis) {
      logger.warn('Claude analysis disabled, returning fallback recommendations');
      return this.getFallbackRecommendations();
    }

    try {
      logger.info(`Getting recommendations from Claude`, { url });

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

      const content = message.content[0].text.trim();
      const parsed = JSON.parse(content);

      logger.info(`Recommendations generated successfully`, { url });
      return parsed;
    } catch (error) {
      logger.error(`Failed to get Claude recommendations`, { error: error.message });
      return this.getFallbackRecommendations();
    }
  }

  buildPrompt(url, scores) {
    return `Analyze this website audit and provide recommendations in JSON format:

URL: ${url}
SEO Score: ${scores.seo}/100
Performance Score: ${scores.performance}/100
Security Score: ${scores.security}/100
Best Practices Score: ${scores.bestPractices}/100

Respond with ONLY valid JSON (no markdown):
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
  }

  getFallbackRecommendations() {
    return {
      recommendations: [
        {
          title: 'Improve Core Web Vitals',
          priority: 'high',
          impact: 'Better SEO ranking and user experience',
          effort: 'medium'
        },
        {
          title: 'Implement security headers',
          priority: 'high',
          impact: 'Protect against common attacks',
          effort: 'easy'
        },
        {
          title: 'Optimize images and assets',
          priority: 'medium',
          impact: 'Faster page load times',
          effort: 'medium'
        }
      ],
      actionPlan: [
        'Add security headers (X-Frame-Options, CSP)',
        'Enable image lazy loading and compression',
        'Improve server response time and caching'
      ]
    };
  }
}

export const recommendationService = new RecommendationService();
