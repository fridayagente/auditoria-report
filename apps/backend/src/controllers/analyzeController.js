import { websiteAnalyzer } from '../services/analysis/websiteAnalyzer.js';
import { recommendationService } from '../services/analysis/recommendationService.js';
import { stripeService } from '../services/payment/stripeService.js';
import { emailService } from '../services/email/emailService.js';
import { validateUrl, validateEmail } from '../utils/validators/urlValidator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AnalyzeController');

export class AnalyzeController {
  async analyze(req, res) {
    try {
      const { url } = req.body;

      // Validate input
      const urlValidation = validateUrl(url);
      if (!urlValidation.valid) {
        return res.status(400).json({ error: urlValidation.error });
      }

      logger.info(`Analysis request`, { url: urlValidation.url });

      // Fetch and analyze website
      const website = await websiteAnalyzer.fetchWebsite(urlValidation.url);

      const seoScore = websiteAnalyzer.calculateSEOScore(website.html, website.headers);
      const performanceScore = websiteAnalyzer.calculatePerformanceScore(website.html, website.headers);
      const securityScore = websiteAnalyzer.calculateSecurityScore(urlValidation.url, website.headers);
      const bestPracticesScore = websiteAnalyzer.calculateBestPracticesScore(website.html, website.headers);

      const overallScore = Math.round(
        (seoScore + performanceScore + securityScore + bestPracticesScore) / 4
      );

      // Get recommendations
      const recommendations = await recommendationService.getRecommendations(urlValidation.url, {
        seo: seoScore,
        performance: performanceScore,
        security: securityScore,
        bestPractices: bestPracticesScore
      });

      const analysis = {
        url: urlValidation.url,
        timestamp: new Date().toISOString(),
        scores: {
          seo: { score: seoScore, class: websiteAnalyzer.getScoreClass(seoScore) },
          performance: { score: performanceScore, class: websiteAnalyzer.getScoreClass(performanceScore) },
          security: { score: securityScore, class: websiteAnalyzer.getScoreClass(securityScore) },
          bestPractices: { score: bestPracticesScore, class: websiteAnalyzer.getScoreClass(bestPracticesScore) },
          overall: { score: overallScore, class: websiteAnalyzer.getScoreClass(overallScore) }
        },
        recommendations: recommendations.recommendations,
        actionPlan: recommendations.actionPlan
      };

      logger.info(`Analysis completed`, { url: urlValidation.url, overall_score: overallScore });

      return res.json({
        success: true,
        analysis
      });
    } catch (error) {
      logger.error(`Analysis failed`, { error: error.message });
      return res.status(500).json({ error: error.message });
    }
  }

  async createCheckout(req, res) {
    try {
      const { email, analysis } = req.body;

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      if (!analysis) {
        return res.status(400).json({ error: 'Analysis data required' });
      }

      logger.info(`Checkout request`, { email: emailValidation.email, url: analysis.url });

      // Create Stripe session
      const session = await stripeService.createCheckoutSession(emailValidation.email, analysis);

      return res.json({
        success: true,
        sessionId: session.id
      });
    } catch (error) {
      logger.error(`Checkout creation failed`, { error: error.message });
      return res.status(500).json({ error: error.message });
    }
  }

  async handlePaymentSuccess(req, res) {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      logger.info(`Payment success notification`, { sessionId });

      const session = await stripeService.getSession(sessionId);

      if (session.payment_status === 'paid') {
        // Send confirmation email
        await emailService.sendPaymentConfirmation(
          session.customer_email,
          { url: session.metadata.url, scores: { overall: { score: session.metadata.overall_score } } },
          sessionId
        );
      }

      return res.json({ success: true, message: 'Payment confirmed' });
    } catch (error) {
      logger.error(`Payment success handling failed`, { error: error.message });
      return res.status(500).json({ error: error.message });
    }
  }
}

export const analyzeController = new AnalyzeController();
