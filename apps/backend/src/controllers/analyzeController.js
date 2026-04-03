/**
 * ANALYZE CONTROLLER
 * 
 * Handles website analysis requests.
 * Orchestrates the analysis workflow: validation → fetching → scoring → recommendations
 * 
 * @file Analysis request controller
 * @author Friday Agent
 */

import { websiteAnalyzer } from '../services/analysis/websiteAnalyzer.js';
import { recommendationService } from '../services/analysis/recommendationService.js';
import { validateAnalysisRequest } from '../utils/validators/inputValidator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AnalyzeController');

export class AnalyzeController {
  /**
   * POST /api/analyze
   * Analyze a website and return audit scores and recommendations
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async analyze(req, res) {
    const requestId = Math.random().toString(36).substr(2, 9);

    try {
      // Validate request
      const validation = validateAnalysisRequest(req.body);
      if (!validation.valid) {
        logger.warn('Analysis validation failed', {
          requestId,
          error: validation.error
        });
        return res.status(400).json({ error: validation.error });
      }

      const { url } = validation.data;
      logger.info('Analysis request received', { requestId, url });

      // Fetch website
      const website = await websiteAnalyzer.fetchWebsite(url);
      logger.debug('Website fetched', { requestId, url });

      // Calculate scores
      const seoScore = websiteAnalyzer.calculateSEOScore(website.html, website.headers);
      const performanceScore = websiteAnalyzer.calculatePerformanceScore(website.html, website.headers);
      const securityScore = websiteAnalyzer.calculateSecurityScore(url, website.headers);
      const bestPracticesScore = websiteAnalyzer.calculateBestPracticesScore(website.html, website.headers);

      // Calculate overall score
      const overallScore = Math.round(
        (seoScore + performanceScore + securityScore + bestPracticesScore) / 4
      );

      logger.info('Scores calculated', {
        requestId,
        seo: seoScore,
        performance: performanceScore,
        security: securityScore,
        bestPractices: bestPracticesScore,
        overall: overallScore
      });

      // Get recommendations
      const recommendations = await recommendationService.getRecommendations(url, {
        seo: seoScore,
        performance: performanceScore,
        security: securityScore,
        bestPractices: bestPracticesScore
      });

      logger.debug('Recommendations received', { requestId, count: recommendations.recommendations.length });

      // Build analysis response
      const analysis = {
        url,
        timestamp: new Date().toISOString(),
        scores: {
          seo: {
            score: seoScore,
            class: websiteAnalyzer.getScoreClass(seoScore)
          },
          performance: {
            score: performanceScore,
            class: websiteAnalyzer.getScoreClass(performanceScore)
          },
          security: {
            score: securityScore,
            class: websiteAnalyzer.getScoreClass(securityScore)
          },
          bestPractices: {
            score: bestPracticesScore,
            class: websiteAnalyzer.getScoreClass(bestPracticesScore)
          },
          overall: {
            score: overallScore,
            class: websiteAnalyzer.getScoreClass(overallScore)
          }
        },
        recommendations: recommendations.recommendations,
        actionPlan: recommendations.actionPlan,
        details: website.details || {}
      };

      logger.info('Analysis completed successfully', { requestId, url, overall: overallScore });

      return res.json({
        success: true,
        analysis,
        requestId
      });
    } catch (error) {
      logger.error('Analysis failed', {
        requestId,
        error: error.message,
        stack: error.stack
      });

      return res.status(500).json({
        error: error.message || 'Website analysis failed. Please try again later.',
        requestId
      });
    }
  }
}

export const analyzeController = new AnalyzeController();
